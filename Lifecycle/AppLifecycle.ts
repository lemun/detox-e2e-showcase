import { device } from 'detox';
import { EventHelper } from '../Helpers/EventHelper';

export class AppLifecycle {
  private static readonly APP_PERMISSIONS = { notifications: 'YES' as const };

  static async initialize(newInstance: boolean): Promise<void> {
    await EventHelper.track('Initialize App', async () => {
      await device.launchApp({
        newInstance,
        delete: newInstance,
        permissions: AppLifecycle.APP_PERMISSIONS,
      });
      await device.takeScreenshot('app-launch');
    });
  }

  static async reload(): Promise<void> {
    await EventHelper.track('Reload App', async () => {
      await device.reloadReactNative();
    });
  }

  static async cleanup(): Promise<void> {
    await EventHelper.track('Cleanup App', async () => {
      await device.terminateApp();
      await device.uninstallApp();

      if (device.getPlatform() === 'ios') {
        await device.resetContentAndSettings();
      }

      await device.installApp();
    });
  }
}
