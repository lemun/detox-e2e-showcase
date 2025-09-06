import { EventHelper } from '../Helpers/EventHelper';
import { NavigationDestination } from '../Common/Types';
import { TestUtils } from './Utils';

export class NavigationUtils {
  static async navigate<T extends NavigationDestination>(
    navigationDestination: T,
    destination: keyof T,
  ): Promise<void> {
    await EventHelper.track(`Navigating to ${String(destination)}`, async () => {
      await TestUtils.Elements.click(TestUtils.Elements.$(navigationDestination[destination]));
    });
  }

  static async waitForLoad(containerSelector: string, options: { additionalSelectors?: string[] } = {}): Promise<void> {
    const { additionalSelectors = [] } = options;

    await EventHelper.track('Waiting for page to load', async () => {
      const containerElement = TestUtils.Elements.$(containerSelector);
      await TestUtils.Elements.waitForElementToBeVisible(containerElement, { shouldBeVisible: true });

      for (const selector of additionalSelectors) {
        await TestUtils.Elements.waitForElementToBeVisible(TestUtils.Elements.$(selector), { shouldBeVisible: true });
      }
    });
  }
}
