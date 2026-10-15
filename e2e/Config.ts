/** Settings shared by the whole suite. Environment variables override the defaults. */
export const config = {
  /** How long one wait (for a view to appear, go away or become enabled) may take. */
  waitMs: Number(process.env.E2E_WAIT_MS ?? 12_000),
  /** Port of the fake backend. example-app/src/api.ts points at the same port. */
  backendPort: Number(process.env.FAKE_BACKEND_PORT ?? 4545),
} as const;

export const backendUrl = `http://127.0.0.1:${config.backendPort}`;
