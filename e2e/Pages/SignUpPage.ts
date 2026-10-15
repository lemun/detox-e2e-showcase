import { Control } from '../Core/Control';
import type { Person } from '../Model';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

/** Two steps on one screen: account details, then the emailed 6-digit code. */
class SignUpPage extends ScreenObject {
  protected readonly label = 'Create-account screen';

  protected readonly rootId = ids.signUp.screen;

  protected override readonly readyIds = [ids.signUp.detailsStep];

  public async enterDetails(person: Person, options: { acceptTerms?: boolean } = {}): Promise<void> {
    const { acceptTerms = true } = options;

    await Control.id(ids.signUp.name).fill(person.name);
    await Control.id(ids.signUp.email).fill(person.email);
    await Control.id(ids.signUp.password).fill(person.password);
    await this.closeKeyboard(ids.signUp.detailsTitle);
    await Control.id(ids.signUp.terms).switchTo(acceptTerms);
  }

  /** Taps Next. On valid details the backend issues a code and the code step opens. */
  public async requestCode(): Promise<void> {
    await Control.id(ids.signUp.next).tap();
  }

  public async waitForCodeStep(): Promise<void> {
    await Control.id(ids.signUp.codeStep).appears();
  }

  public async enterCode(code: string): Promise<void> {
    await Control.id(ids.signUp.code).fill(code);
    await this.closeKeyboard(ids.signUp.codeTitle);
  }

  public async createAccount(): Promise<void> {
    await Control.id(ids.signUp.create).tap();
  }

  public async expectFieldError(field: 'email' | 'password', message: string): Promise<void> {
    await Control.id(field === 'email' ? ids.signUp.emailError : ids.signUp.passwordError).expectText(message);
  }
}

export const signUpPage = new SignUpPage();
