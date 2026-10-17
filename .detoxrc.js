/**
 * Detox configuration. iOS simulator only: the sample app in example-app/ ships no Android project.
 * DETOX_DEVICE_TYPE picks the simulator model (default "iPhone 17"); Detox reuses a matching
 * simulator or creates one.
 */
const app = (configuration) => ({
  type: 'ios.app',
  binaryPath: `example-app/ios/build/Build/Products/${configuration}-iphonesimulator/SampleApp.app`,
  build: [
    'xcodebuild',
    '-workspace example-app/ios/SampleApp.xcworkspace',
    '-scheme SampleApp',
    `-configuration ${configuration}`,
    '-sdk iphonesimulator',
    '-derivedDataPath example-app/ios/build',
    '-quiet',
  ].join(' '),
});

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: { $0: 'jest', config: 'e2e/jest.config.js' },
    jest: { setupTimeout: 240000 },
  },
  artifacts: {
    rootDir: 'artifacts',
    plugins: { screenshot: 'failing', log: 'failing' },
  },
  apps: {
    'ios.debug': app('Debug'),
    'ios.release': app('Release'),
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: process.env.DETOX_DEVICE_TYPE ?? 'iPhone 17' },
    },
  },
  configurations: {
    // Debug loads JS from Metro: run `npm --prefix example-app start` first.
    'ios.sim.debug': { device: 'simulator', app: 'ios.debug' },
    // Release bundles the JS into the app, so no Metro is needed. CI and the README use this one.
    'ios.sim.release': { device: 'simulator', app: 'ios.release' },
  },
};
