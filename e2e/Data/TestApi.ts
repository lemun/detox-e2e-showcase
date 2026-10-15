import { backendUrl } from '../Config';
import type { Person, StoredAccount } from '../Model';

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(`Test API ${method} ${path} answered ${response.status}: ${await response.text()}`);
  }

  return (response.status === 204 ? undefined : await response.json()) as T;
}

function byEmail(path: string, email: string): string {
  return `${path}?email=${encodeURIComponent(email)}`;
}

/**
 * Test-only access to backend data, through the fake backend's /__test__ routes. Specs and flows use
 * it to set data up, to read the code the app "emailed", and to check what the backend really
 * stored, so a green UI check is backed by a data check. Nothing else in the suite knows how test
 * data is reached: pointing the suite at another backend means reimplementing these four functions.
 */
export const testApi = {
  async reset(): Promise<void> {
    await call('POST', '/__test__/reset');
  },

  async seed(people: readonly Person[]): Promise<void> {
    await call('POST', '/__test__/seed', { users: people });
  },

  async latestCode(email: string): Promise<string> {
    const { code } = await call<{ code: string }>('GET', byEmail('/__test__/verification-code', email));

    return code;
  },

  async account(email: string): Promise<StoredAccount> {
    return await call<StoredAccount>('GET', byEmail('/__test__/user', email));
  },
};
