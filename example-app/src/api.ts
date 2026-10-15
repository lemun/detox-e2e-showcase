// The fake backend in ../fake-backend listens here. The iOS simulator shares the host's network,
// so localhost reaches it directly (the template Info.plist sets NSAllowsLocalNetworking).
export const API_URL = 'http://localhost:4545';

export interface User {
  readonly name: string;
  readonly email: string;
}

export interface Preferences {
  readonly productUpdates: boolean;
  readonly weeklyDigest: boolean;
  readonly reminders: boolean;
}

export interface Session {
  readonly token: string;
  readonly user: User;
}

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new ApiError(body.error ?? `Request failed (${response.status})`, response.status);
  }

  return body;
}

export const api = {
  signUp: (input: { name: string; email: string; password: string }) =>
    request<{ email: string }>('/auth/sign-up', { method: 'POST', body: JSON.stringify(input) }),

  verifyEmail: (input: { email: string; code: string }) =>
    request<Session>('/auth/verify-email', { method: 'POST', body: JSON.stringify(input) }),

  signIn: (input: { email: string; password: string }) =>
    request<Session>('/auth/sign-in', { method: 'POST', body: JSON.stringify(input) }),

  getPreferences: (token: string) => request<Preferences>('/me/preferences', {}, token),

  savePreferences: (token: string, preferences: Preferences) =>
    request<Preferences>('/me/preferences', { method: 'PUT', body: JSON.stringify(preferences) }, token),
};
