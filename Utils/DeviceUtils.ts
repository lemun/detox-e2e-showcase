import { device } from 'detox';
import { EventHelper } from '../Helpers/EventHelper';
import { TestUtils } from './Utils';

export class DeviceUtils {
  static async isAndroid(): Promise<boolean> {
    return device.getPlatform() === 'android';
  }

  static async sleep(timeInSeconds: number): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, timeInSeconds * 1000);
    });
  }

  static async screenshot(screenshotName: string): Promise<void> {
    await EventHelper.track(`Taking screenshot: ${screenshotName}`, async () => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await device.takeScreenshot(`${screenshotName}-${timestamp}`);
    });
  }

  static async pressBack(options: { isButton?: boolean } = {}): Promise<void> {
    await EventHelper.track('Pressing back', async () => {
      const { isButton } = options;

      if (isButton) {
        await TestUtils.Elements.click(TestUtils.Elements.$('back'));
      } else if (await this.isAndroid()) {
        await device.pressBack();
      } else {
        await TestUtils.Elements.$('ScrollView').indexableNativeElement.swipe('left', 'fast', 0.8, 1, 0);
      }
    });
  }
}
