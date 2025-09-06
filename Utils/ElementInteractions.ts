import { expect } from 'detox';
import { SelectorOptions, ElementOptions, WaitForOptions } from '../Common/Interfaces';
import { NativeElement } from '../Common/Types';
import { DEFAULT_TIMEOUT } from '../Common/Consts';
import { EventHelper } from '../Helpers/EventHelper';
import { TestUtils } from './Utils';

export class ElementInteractions {
  static $(testID: string, options: SelectorOptions = {}): NativeElement {
    const { selectorType = 'id' } = options;

    if (selectorType === 'traits') {
      return { indexableNativeElement: element(by[selectorType]([testID])), testID };
    }

    return { indexableNativeElement: element(by[selectorType](testID)), testID };
  }

  static async click(element: NativeElement, options: ElementOptions = {}): Promise<void> {
    const { isWaitNotToExist, timeout } = options;

    await EventHelper.track(`Clicking element: ${element.testID}`, async () => {
      await this.waitForElementToBeVisible(element, { shouldBeVisible: true });
      await element.indexableNativeElement.tap();

      if (isWaitNotToExist) {
        await this.waitForElementToExist(element, {
          shouldExist: false,
          timeout,
        });
      }
    });
  }

  static async type(element: NativeElement, text: string, options: ElementOptions = {}): Promise<void> {
    const { isDismissKeyboard } = options;

    await EventHelper.track(`Typing into element: ${element.testID}`, async () => {
      await this.waitForElementToExist(element, { shouldExist: true });
      await element.indexableNativeElement.typeText(text);

      if (isDismissKeyboard) {
        await this.click(this.$(isDismissKeyboard.dismissKeyboardTestID));
      }
    });
  }

  static async checkbox(element: NativeElement, toggleValue: boolean): Promise<void> {
    await EventHelper.track(`Setting checkbox ${element.testID} to ${toggleValue}`, async () => {
      await this.waitForElementToExist(element, { shouldExist: true });

      try {
        await expect(
          this.$(`${element.testID}.${toggleValue ? 'true' : 'false'}`).indexableNativeElement,
        ).toBeVisible();
      } catch {
        if (await TestUtils.Device.isAndroid()) {
          await element.indexableNativeElement.tap();
        } else {
          const elementAttributes = await element.indexableNativeElement.getAttributes();

          if ('normalizedActivationPoint' in elementAttributes) {
            const { x, y } = elementAttributes.normalizedActivationPoint;
            await element.indexableNativeElement.tap({ x, y });
          }
        }
      }
    });
  }

  static async waitForElementToExist(element: NativeElement, options: WaitForOptions = {}): Promise<void> {
    const { shouldExist = true, shouldIgnoreError, timeout } = options;
    await EventHelper.track(
      `Waiting for element ${element.testID} to ${shouldExist ? 'exist' : 'not exist'}`,
      async () => {
        try {
          if (shouldExist) {
            await waitFor(element.indexableNativeElement)
              .toExist()
              .withTimeout(timeout ?? DEFAULT_TIMEOUT);
          } else {
            await waitFor(element.indexableNativeElement)
              .not.toExist()
              .withTimeout(timeout ?? DEFAULT_TIMEOUT);
          }
        } catch (error) {
          if (!shouldIgnoreError) {
            throw new Error(`Element ${element.testID} ${shouldExist ? 'did not appear' : 'still exists'}`);
          }
        }
      },
      { showSuccessMessage: false },
    );
  }

  static async waitForElementToBeVisible(element: NativeElement, options: WaitForOptions = {}): Promise<void> {
    const { shouldBeVisible = true, shouldIgnoreError, timeout } = options;
    await EventHelper.track(
      `Waiting for element ${element.testID} to be ${shouldBeVisible ? 'visible' : 'invisible'}`,
      async () => {
        await this.waitForElementToExist(element, { shouldExist: true });
        try {
          if (shouldBeVisible) {
            await waitFor(element.indexableNativeElement)
              .toBeVisible()
              .withTimeout(timeout ?? DEFAULT_TIMEOUT);
          } else {
            await waitFor(element.indexableNativeElement)
              .not.toBeVisible()
              .withTimeout(timeout ?? DEFAULT_TIMEOUT);
          }
        } catch (error) {
          if (!shouldIgnoreError) {
            throw new Error(`Element ${element.testID} ${shouldBeVisible ? 'not visible' : 'still visible'}`);
          }
        }
      },
      { showSuccessMessage: false },
    );
  }

  static async waitForElementToBeClickable(element: NativeElement, options: WaitForOptions = {}): Promise<void> {
    const { shouldIgnoreError, timeout } = options;

    await EventHelper.track(`Waiting for element ${element.testID} to be clickable`, async () => {
      try {
        await this.waitForElementToBeVisible(element, { shouldBeVisible: true });
        const elementAttributes = await element.indexableNativeElement.getAttributes();

        if ('enabled' in elementAttributes && !elementAttributes.enabled) {
          await TestUtils.Device.sleep((timeout ?? DEFAULT_TIMEOUT) / 1000);

          if (!shouldIgnoreError) {
            throw new Error(`Element ${element.testID} not clickable`);
          }
        }
      } catch (error) {
        if (!shouldIgnoreError) {
          throw error;
        }
      }
    });
  }
}
