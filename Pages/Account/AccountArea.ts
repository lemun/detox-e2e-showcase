import Page from '../Page';
import { NavigationDestination } from '../../Utils/Utils';

interface AccountAreaNavigationDestination extends NavigationDestination {
  readonly settings: string;
  readonly editCommunication: string;
}

class AccountArea extends Page {
  private accountAreaSelectors = Page.selectors.account.accountArea;

  private readonly navigationDestination: AccountAreaNavigationDestination = {
    settings: this.accountAreaSelectors.settingsButton,
    editCommunication: this.accountAreaSelectors.editButton,
  };

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.accountAreaSelectors;
    await Page.waitForLoad(containerView);
  }

  public async navigate(destination: keyof AccountAreaNavigationDestination): Promise<void> {
    const destinationElement = Page.$(this.navigationDestination[destination]);

    await Page.waitForElementToBeClickable(destinationElement);
    await Page.navigate(this.navigationDestination, destination);
    await Page.waitForElementToBeVisible(destinationElement, { shouldBeVisible: true });
  }

  public async isOptionAvailable(option: keyof AccountAreaNavigationDestination): Promise<boolean> {
    const element = Page.$(this.navigationDestination[option]);
    try {
      await Page.waitForElementToBeVisible(element, {
        shouldBeVisible: true,
        shouldIgnoreError: true,
      });

      return true;
    } catch {
      return false;
    }
  }
}

export default new AccountArea();
