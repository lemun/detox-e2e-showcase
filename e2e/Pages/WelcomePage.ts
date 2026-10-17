import { Control } from '../Core/Control';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

class WelcomePage extends ScreenObject {
  protected readonly label = 'Welcome screen';

  protected readonly rootId = ids.welcome.screen;

  public async chooseSignIn(): Promise<void> {
    await Control.id(ids.welcome.signIn).tap();
  }

  public async chooseCreateAccount(): Promise<void> {
    await Control.id(ids.welcome.createAccount).tap();
  }
}

export const welcomePage = new WelcomePage();
