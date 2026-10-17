import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { type FakeBackend, startFakeBackend } from './Server';

let backend: FakeBackend;

async function call(method: string, path: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${backend.url}${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();

  return { status: response.status, body: text ? (JSON.parse(text) as Record<string, unknown>) : null };
}

const avery = { name: 'Avery Example', email: 'avery@example.com', password: 'sample-pass-1' };

describe('fake backend', () => {
  beforeAll(async () => {
    backend = await startFakeBackend({ port: 0, enableTestRoutes: true });
  });

  afterAll(async () => {
    await backend.close();
  });

  beforeEach(async () => {
    await call('POST', '/__test__/reset');
  });

  it('signs up, issues a code readable through the test route, and verifies it', async () => {
    expect((await call('POST', '/auth/sign-up', avery)).status).toBe(201);

    const { body: codeBody } = await call('GET', `/__test__/verification-code?email=${avery.email}`);
    const code = codeBody?.code;
    expect(code).toMatch(/^\d{6}$/);

    const wrong = await call('POST', '/auth/verify-email', {
      email: avery.email,
      code: code === '000000' ? '111111' : '000000',
    });
    expect(wrong.status).toBe(400);

    const verified = await call('POST', '/auth/verify-email', { email: avery.email, code });
    expect(verified.status).toBe(200);
    expect(verified.body?.user).toEqual({ name: avery.name, email: avery.email });
  });

  it('rejects a duplicate verified account', async () => {
    await call('POST', '/__test__/seed', { users: [avery] });
    expect((await call('POST', '/auth/sign-up', avery)).status).toBe(409);
  });

  it('signs in seeded users and rejects wrong passwords', async () => {
    await call('POST', '/__test__/seed', { users: [avery] });

    expect((await call('POST', '/auth/sign-in', { email: avery.email, password: 'nope-nope' })).status).toBe(401);

    const ok = await call('POST', '/auth/sign-in', { email: avery.email, password: avery.password });
    expect(ok.status).toBe(200);
    expect(typeof ok.body?.token).toBe('string');
  });

  it('reads and writes preferences for the signed-in user only', async () => {
    await call('POST', '/__test__/seed', { users: [{ ...avery, preferences: { weeklyDigest: true } }] });
    const { body } = await call('POST', '/auth/sign-in', { email: avery.email, password: avery.password });
    const token = body?.token as string;

    expect((await call('GET', '/me/preferences')).status).toBe(401);
    expect((await call('GET', '/me/preferences', undefined, token)).body).toEqual({
      productUpdates: true,
      weeklyDigest: true,
      reminders: false,
    });

    const next = { productUpdates: false, weeklyDigest: false, reminders: true };
    expect((await call('PUT', '/me/preferences', next, token)).body).toEqual(next);
    expect((await call('GET', `/__test__/user?email=${avery.email}`)).body?.preferences).toEqual(next);
    expect((await call('PUT', '/me/preferences', { reminders: 'yes' }, token)).status).toBe(400);
  });

  it('hands every issued code to onCodeIssued instead of mailing it', async () => {
    const issued: string[] = [];
    const logging = await startFakeBackend({ port: 0, onCodeIssued: (email, code) => issued.push(`${email} ${code}`) });

    try {
      const response = await fetch(`${logging.url}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avery),
      });
      expect(response.status).toBe(201);
      expect(issued).toHaveLength(1);
      expect(issued[0]).toMatch(/^avery@example\.com \d{6}$/);
    } finally {
      await logging.close();
    }
  });

  it('hides test routes unless enabled', async () => {
    const plain = await startFakeBackend({ port: 0 });

    try {
      const response = await fetch(`${plain.url}/__test__/reset`, { method: 'POST' });
      expect(response.status).toBe(404);
    } finally {
      await plain.close();
    }
  });
});
