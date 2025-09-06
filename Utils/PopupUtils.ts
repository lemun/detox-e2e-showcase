import { EventHelper } from '../Helpers/EventHelper';
import { PopupType } from '../Common/Types';
import { PopupOptions } from '../Common/Interfaces';
import { Selectors } from '../Selectors/Selectors';
import { TestUtils, DefaultConfig } from './Utils';

export class PopupUtils {
  static async handlePopup(type: PopupType, options: PopupOptions = {}): Promise<void> {
    const { shouldBeVisible, shouldDismiss, buttonText, errorMessage } = options;
    const { popup } = Selectors.components;

    await EventHelper.track(
      `Handling ${type} popup`,
      async () => {
        const popupElement = TestUtils.Elements.$(popup);

        if (shouldBeVisible) {
          await TestUtils.Elements.waitForElementToExist(popupElement, { shouldExist: true });

          if (shouldDismiss) {
            await this.dismissPopup(buttonText);
          }
        } else {
          await TestUtils.Elements.waitForElementToExist(popupElement, { shouldExist: false });
        }
      },
      { showErrorTrace: Boolean(errorMessage) },
    );
  }

  private static async dismissPopup(buttonText?: string): Promise<void> {
    const dismissText = buttonText ?? DefaultConfig.popupDismissText;
    const dismissButton = TestUtils.Elements.$(dismissText, { selectorType: 'text' });

    await TestUtils.Elements.click(dismissButton);
  }
}
