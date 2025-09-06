import Page from '../Page';
import { NavigationDestination } from '../../Utils/Utils';

interface BottomTabNavigationDestination extends NavigationDestination {
  readonly home: string;
  readonly account: string;
}

class BottomTabsNavigator extends Page {
  private navigatorsSelectors = Page.selectors.navigators;

  private readonly navigationDestination: BottomTabNavigationDestination = {
    home: this.navigatorsSelectors.BottomTabsNavigator.homePage,
    account: this.navigatorsSelectors.BottomTabsNavigator.accountPage,
  };

  public async waitForLoad(): Promise<void> {
    const { homePage } = this.navigatorsSelectors.BottomTabsNavigator;
    await Page.waitForLoad(homePage);
  }

  public async navigate(destination: keyof BottomTabNavigationDestination): Promise<void> {
    const destinationElement = Page.$(this.navigationDestination[destination]);

    await Page.waitForElementToBeClickable(destinationElement);
    await Page.navigate(this.navigationDestination, destination);
    await Page.waitForElementToBeVisible(destinationElement, { shouldBeVisible: true });
  }
}

export default new BottomTabsNavigator();
