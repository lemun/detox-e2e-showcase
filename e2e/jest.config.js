/** Jest settings for the Detox run. .detoxrc.js points Detox at this file (testRunner.args.config). */
/** @type {import('jest').Config} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/Specs/**/*.spec.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  // One simulator and one backend port, so spec files run one after another.
  maxWorkers: 1,
  testTimeout: 120_000,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};
