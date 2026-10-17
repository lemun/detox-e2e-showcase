import { Control } from '../Core/Control';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

class SignInPage extends ScreenObject {
  protected readonly label = 'Sign-in screen';

  protected readonly rootId = ids.signIn.screen;

  public async enterCredentials(email: string, password: string): Promise<void> {
    await Control.id(ids.signIn.email).fill(email);
    await Control.id(ids.signIn.password).fill(password);
    await this.closeKeyboard(ids.signIn.title);
  }

  /** Only submits. The caller decides what should follow: Home, or an error dialog. */
  public async submit(): Promise<void> {
    await Control.id(ids.signIn.submit).tap();
  }
}

export const signInPage = new SignInPage();
