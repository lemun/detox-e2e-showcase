import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import { device } from 'detox';
import { type FakeBackend, startFakeBackend } from '../../fake-backend/Server';
import { config } from '../Config';
import { step } from '../Core/Steps';
import { testApi } from '../Data/TestApi';
import type { Person } from '../Model';

/**
 * Registers the Jest hooks a spec file needs, so specs contain only tests:
 * - once per file: start the fake backend in this process;
 * - before each test: wipe the data, seed `seed`, and start the app in a new process (the first
 *   launch of the file also reinstalls it, so nothing survives from an earlier run);
 * - after the file: stop the app and the backend.
 * Call it once at the top of a describe block.
 */
export function prepareSuite(seed: readonly Person[]): void {
  let backend: FakeBackend | undefined;
  let firstLaunch = true;

  beforeAll(async () => {
    await step('Start the fake backend', async () => {
      backend = await startFakeBackend({ port: config.backendPort, enableTestRoutes: true });
    });
  });

  beforeEach(async () => {
    await step('Fresh data and a fresh app process', async () => {
      await testApi.reset();
      await testApi.seed(seed);
      await device.launchApp({ newInstance: true, delete: firstLaunch });
      firstLaunch = false;
    });
  });

  afterAll(async () => {
    await step('Stop the app and the backend', async () => {
      await device.terminateApp();
      await backend?.close();
    });
  });
}
