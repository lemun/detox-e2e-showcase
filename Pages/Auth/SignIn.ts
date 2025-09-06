import Page from '../Page';

class SignIn extends Page {
  private signInSelectors = Page.selectors.auth.signIn;

  private readonly DEFAULT_PASSWORD = process.env.USER_PASSWORD ?? '';

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.signInSelectors;
    await Page.waitForLoad(containerView);
  }

  public async fillSignInDetails(params: {
    userId: string;
    password?: string;
    rememberMe?: boolean;
  }): Promise<void> {
    await this.setUserId(params.userId);
    await this.setPassword(params.password ?? this.DEFAULT_PASSWORD);
    await this.toggleRememberMe(params.rememberMe ?? false);

    await this.submitForm();
  }

  private async setUserId(userId: string): Promise<void> {
    const { userIdField, containerText } = this.signInSelectors;
    await Page.type(Page.$(userIdField), userId, {
      isDismissKeyboard: { dismissKeyboardTestID: containerText },
    });
  }

  private async setPassword(password: string): Promise<void> {
    const { passwordField, containerText } = this.signInSelectors;
    await Page.type(Page.$(passwordField), password, {
      isDismissKeyboard: { dismissKeyboardTestID: containerText },
    });
  }

  public async toggleRememberMe(toggleValue: boolean): Promise<void> {
    const { rememberMeCheckbox } = this.signInSelectors;
    await Page.checkbox(Page.$(rememberMeCheckbox), toggleValue);
  }

  public async submitForm(): Promise<void> {
    const { signInButton } = this.signInSelectors;
    await Page.click(Page.$(signInButton), { isWaitNotToExist: true });
  }
}

export default new SignIn();
