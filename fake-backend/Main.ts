import { DEFAULT_PORT, startFakeBackend } from './Server';

// Standalone entry point for poking at the app by hand: `npm run backend`.
async function main(): Promise<void> {
  const port = Number(process.env.FAKE_BACKEND_PORT ?? DEFAULT_PORT);
  const backend = await startFakeBackend({
    port,
    enableTestRoutes: true,
    // No mail is sent: print the code so a person using the app by hand can type it in.
    onCodeIssued: (email, code) => process.stdout.write(`Verification code for ${email}: ${code}\n`),
  });
  process.stdout.write(`Fake backend listening on ${backend.url} (test routes enabled)\n`);

  const shutdown = () => {
    void backend.close().finally(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
