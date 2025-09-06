import Page from '../Page';
import { NavigationDestination } from '../../Utils/Utils';
import { EventHelper } from '../../Helpers/EventHelper';

interface LandingScreenNavigationDestination extends NavigationDestination {
  readonly signIn: string;
  readonly signUp: string;
}

class LandingScreen extends Page {
  private landingScreenSelectors = Page.selectors.auth.landingScreen;

  private readonly navigationDestination: LandingScreenNavigationDestination = {
    signIn: this.landingScreenSelectors.signInButton,
    signUp: this.landingScreenSelectors.signUpButton,
  };

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.landingScreenSelectors;
    await Page.waitForLoad(containerView);
  }

  public async navigate(destination: keyof LandingScreenNavigationDestination): Promise<void> {
    await Page.navigate(this.navigationDestination, destination);
  }
}

export default new LandingScreen();
