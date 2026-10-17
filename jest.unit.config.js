/** Fast, simulator-free tests (fake backend). The Detox suite uses e2e/jest.config.js. */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/fake-backend'],
  testMatch: ['**/*.test.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
};
