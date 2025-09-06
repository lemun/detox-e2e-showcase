import Page from '../Page';
import { NavigationDestination } from '../../Utils/Utils';

interface FormNavigatorFooterDestination extends NavigationDestination {
  readonly nextStage: string;
  readonly submit: string;
}

class FormNavigatorFooter extends Page {
  private navigatorsSelectors = Page.selectors.navigators;

  private readonly navigationDestination: FormNavigatorFooterDestination = {
    nextStage: this.navigatorsSelectors.FormNavigatorFooter.nextStage,
    submit: this.navigatorsSelectors.FormNavigatorFooter.submit,
  };

  public async navigate(destination: keyof FormNavigatorFooterDestination): Promise<void> {
    const destinationElement = Page.$(this.navigationDestination[destination]);

    await Page.waitForElementToBeClickable(destinationElement);
    await Page.navigate(this.navigationDestination, destination);
  }

  public async waitForNavigationState(destination: keyof FormNavigatorFooterDestination): Promise<boolean> {
    const element = Page.$(this.navigationDestination[destination]);

    try {
      await Page.waitForElementToBeClickable(element);

      return true;
    } catch {
      return false;
    }
  }
}

export default new FormNavigatorFooter();
