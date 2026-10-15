import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { type Preferences, type SeedUser, Store } from './Store';

export const DEFAULT_PORT = 4545;

export interface FakeBackend {
  readonly url: string;
  readonly store: Store;
  close(): Promise<void>;
}

export interface FakeBackendOptions {
  readonly port?: number;
  /** Exposes the /__test__ routes the e2e suite uses to seed data and read verification codes. */
  readonly enableTestRoutes?: boolean;
  /** Called with every verification code the backend issues, in place of sending an email. */
  readonly onCodeIssued?: (email: string, code: string) => void;
}

class HttpError extends Error {
  public constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(chunk as Buffer);
  }

  if (chunks.length === 0) return {};

  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new HttpError(400, 'Expected a JSON object');
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HttpError) throw error;

    throw new HttpError(400, 'Invalid JSON body');
  }
}

function requireString(body: Record<string, unknown>, field: string): string {
  const value = body[field];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `"${field}" is required`);
  }

  return value;
}

function send(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function publicUser(user: { name: string; email: string }) {
  return { name: user.name, email: user.email };
}

function parsePreferences(body: Record<string, unknown>): Preferences {
  const keys = ['productUpdates', 'weeklyDigest', 'reminders'] as const;

  for (const key of keys) {
    if (typeof body[key] !== 'boolean') {
      throw new HttpError(400, `"${key}" must be a boolean`);
    }
  }

  return {
    productUpdates: body.productUpdates as boolean,
    weeklyDigest: body.weeklyDigest as boolean,
    reminders: body.reminders as boolean,
  };
}

async function route(
  store: Store,
  request: IncomingMessage,
  options: { enableTestRoutes: boolean; onCodeIssued: FakeBackendOptions['onCodeIssued'] | undefined },
): Promise<[number, unknown]> {
  const { enableTestRoutes, onCodeIssued } = options;
  const url = new URL(request.url ?? '/', 'http://localhost');
  const key = `${request.method ?? 'GET'} ${url.pathname}`;

  switch (key) {
    case 'GET /health':
      return [200, { ok: true }];

    case 'POST /auth/sign-up': {
      const body = await readJson(request);
      const name = requireString(body, 'name');
      const email = requireString(body, 'email');
      const password = requireString(body, 'password');

      if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Enter a valid email address');
      if (password.length < 8) throw new HttpError(400, 'Use at least 8 characters');

      const existing = store.findUser(email);

      if (existing?.verified) throw new HttpError(409, 'An account with this email already exists');

      if (!existing) store.createPendingUser(name, email, password);
      const issued = store.issueVerificationCode(email);
      onCodeIssued?.(email, issued.code);

      return [201, { email }];
    }

    case 'POST /auth/verify-email': {
      const body = await readJson(request);
      const email = requireString(body, 'email');
      const code = requireString(body, 'code');
      const user = store.findUser(email);
      const latest = store.latestVerificationCode(email);

      if (!user || latest?.code !== code.trim()) throw new HttpError(400, 'That code is not valid');

      user.verified = true;
      const session = store.createSession(email);

      return [200, { token: session.token, user: publicUser(user) }];
    }

    case 'POST /auth/sign-in': {
      const body = await readJson(request);
      const email = requireString(body, 'email');
      const password = requireString(body, 'password');
      const user = store.findUser(email);

      if (!user || !user.verified || user.password !== password) {
        throw new HttpError(401, 'Email or password is incorrect');
      }

      const session = store.createSession(email);

      return [200, { token: session.token, user: publicUser(user) }];
    }

    case 'GET /me/preferences':
    case 'PUT /me/preferences': {
      const token = (request.headers.authorization ?? '').replace(/^Bearer /, '');
      const user = store.userForToken(token);

      if (!user) throw new HttpError(401, 'Not signed in');

      if (request.method === 'PUT') {
        user.preferences = parsePreferences(await readJson(request));
      }

      return [200, user.preferences];
    }

    default:
      break;
  }

  if (enableTestRoutes) {
    switch (key) {
      case 'POST /__test__/reset':
        store.reset();

        return [204, null];

      case 'POST /__test__/seed': {
        const body = await readJson(request);

        if (!Array.isArray(body.users)) throw new HttpError(400, '"users" must be an array');

        store.seed(body.users as SeedUser[]);

        return [204, null];
      }

      case 'GET /__test__/verification-code': {
        const record = store.latestVerificationCode(url.searchParams.get('email') ?? '');

        if (!record) throw new HttpError(404, 'No verification code for that email');

        return [200, { code: record.code, createdAt: record.createdAt }];
      }

      case 'GET /__test__/user': {
        const user = store.findUser(url.searchParams.get('email') ?? '');

        if (!user) throw new HttpError(404, 'No such user');

        return [200, { ...publicUser(user), verified: user.verified, preferences: user.preferences }];
      }

      default:
        break;
    }
  }

  throw new HttpError(404, `No route for ${key}`);
}

function listen(server: Server, port: number, host: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolve((server.address() as AddressInfo).port);
    });
  });
}

function close(server: Server): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

/**
 * Starts the backend on loopback only: 127.0.0.1, plus ::1 when the machine has IPv6 loopback, so
 * "localhost" works whichever address the simulator resolves it to. Nothing listens on the LAN.
 */
export async function startFakeBackend(options: FakeBackendOptions = {}): Promise<FakeBackend> {
  const { port = DEFAULT_PORT, enableTestRoutes = false, onCodeIssued } = options;
  const store = new Store();

  const handler = (request: IncomingMessage, response: ServerResponse) => {
    route(store, request, { enableTestRoutes, onCodeIssued })
      .then(([status, body]) => {
        if (status === 204) {
          response.writeHead(204).end();
        } else {
          send(response, status, body);
        }
      })
      .catch((error: unknown) => {
        const status = error instanceof HttpError ? error.status : 500;
        const message = error instanceof Error ? error.message : 'Internal error';
        send(response, status, { error: message });
      });
  };

  const primary = createServer(handler);
  const servers: Server[] = [primary];
  const boundPort = await listen(primary, port, '127.0.0.1');

  const ipv6 = createServer(handler);

  try {
    await listen(ipv6, boundPort, '::1');
    servers.push(ipv6);
  } catch {
    // No IPv6 loopback on this machine; 127.0.0.1 is enough.
  }

  return {
    url: `http://127.0.0.1:${boundPort}`,
    store,
    close: async () => {
      await Promise.all(servers.map(close));
    },
  };
}
