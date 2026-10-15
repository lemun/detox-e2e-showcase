import type { Person } from '../Model';

/** Accounts that exist before every test (the harness seeds them after each reset). */
export const people = {
  avery: { name: 'Avery Example', email: 'avery@example.com', password: 'sample-pass-1' },
  jordan: {
    name: 'Jordan Example',
    email: 'jordan@example.com',
    password: 'sample-pass-2',
    preferences: { weeklyDigest: true },
  },
} as const satisfies Record<string, Person>;

export const seededPeople: readonly Person[] = Object.values(people);

/** Someone with no account yet. The email is unique per call, so sign-up tests never collide. */
export function newPerson(): Person {
  const tag = `${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;

  return { name: 'Sam Example', email: `sam.${tag}@example.com`, password: 'sample-pass-3' };
}
