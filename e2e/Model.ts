/** The sample app's data, as the suite sees it. Mirrors example-app/src/api.ts and fake-backend/Store.ts. */

export interface Preferences {
  readonly productUpdates: boolean;
  readonly weeklyDigest: boolean;
  readonly reminders: boolean;
}

/** Someone who uses the app in a test: either seeded into the backend or created by signing up. */
export interface Person {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  /** Seeded people can start with non-default notification settings. */
  readonly preferences?: Partial<Preferences>;
}

/** An account as the backend stored it, read back through the test API. */
export interface StoredAccount {
  readonly name: string;
  readonly email: string;
  readonly verified: boolean;
  readonly preferences: Preferences;
}
