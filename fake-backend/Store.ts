import { randomBytes, randomInt } from 'node:crypto';

export interface Preferences {
  productUpdates: boolean;
  weeklyDigest: boolean;
  reminders: boolean;
}

export interface UserRecord {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  preferences: Preferences;
}

export interface VerificationCodeRecord {
  email: string;
  code: string;
  createdAt: number;
}

export interface SessionRecord {
  token: string;
  email: string;
}

export interface SeedUser {
  name: string;
  email: string;
  password: string;
  preferences?: Partial<Preferences>;
}

export const DEFAULT_PREFERENCES: Readonly<Preferences> = {
  productUpdates: true,
  weeklyDigest: false,
  reminders: false,
};

/**
 * Everything the fake backend knows, held in memory: accounts, issued verification codes and
 * sessions. A reset empties it, so every e2e test starts from the same known data.
 */
export class Store {
  private users = new Map<string, UserRecord>();

  private verificationCodes: VerificationCodeRecord[] = [];

  private sessions = new Map<string, SessionRecord>();

  public reset(): void {
    this.users.clear();
    this.verificationCodes = [];
    this.sessions.clear();
  }

  public seed(users: readonly SeedUser[]): void {
    for (const user of users) {
      this.users.set(Store.key(user.email), {
        name: user.name,
        email: user.email,
        password: user.password,
        verified: true,
        preferences: { ...DEFAULT_PREFERENCES, ...user.preferences },
      });
    }
  }

  public findUser(email: string): UserRecord | undefined {
    return this.users.get(Store.key(email));
  }

  public createPendingUser(name: string, email: string, password: string): UserRecord {
    const user: UserRecord = { name, email, password, verified: false, preferences: { ...DEFAULT_PREFERENCES } };
    this.users.set(Store.key(email), user);

    return user;
  }

  public issueVerificationCode(email: string): VerificationCodeRecord {
    const record = {
      email: Store.key(email),
      code: randomInt(0, 1_000_000).toString().padStart(6, '0'),
      createdAt: Date.now(),
    };
    this.verificationCodes.push(record);

    return record;
  }

  /** The most recent code issued for an address; older ones stop counting once a new one is sent. */
  public latestVerificationCode(email: string): VerificationCodeRecord | undefined {
    const key = Store.key(email);

    return this.verificationCodes.filter((record) => record.email === key).at(-1);
  }

  public createSession(email: string): SessionRecord {
    const session = { token: randomBytes(24).toString('hex'), email: Store.key(email) };
    this.sessions.set(session.token, session);

    return session;
  }

  public userForToken(token: string): UserRecord | undefined {
    const session = this.sessions.get(token);

    return session ? this.findUser(session.email) : undefined;
  }

  private static key(email: string): string {
    return email.trim().toLowerCase();
  }
}
