import Page from '../Page';
import { AuthenticationDate } from '../../Utils/Utils';
import { MongoHelper } from '../../Helpers/MongoHelper';
import { EventHelper } from '../../Helpers/EventHelper';
import FormNavigatorFooter from '../Navigators/FormNavigatorFooter';

interface DatePickerEntry {
  index: number;
  selectedValue: number;
  currentValue: number;
  label: string;
}

interface SwipeOperation {
  direction: 'up' | 'down';
  count: number;
}

class SignUp extends Page {
  private signUpSelectors = Page.selectors.auth.signUp;

  private readonly DEFAULT_PASSWORD = process.env.USER_PASSWORD ?? '';

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.signUpSelectors;
    await Page.waitForLoad(containerView);
  }

  public async fillPersonalDetails(
    userId: string,
    authenticationQuestion: number,
    authenticationDate: AuthenticationDate,
  ): Promise<void> {
    await EventHelper.track('Filling Personal Details', async () => {
      await this.waitForLoad();
      await this.setUserId(userId);
      await this.setAuthenticationQuestion(authenticationQuestion);
      await this.setAuthenticationDate(authenticationDate);
      await this.setTermsOfServiceCheckbox();

      await FormNavigatorFooter.navigate('nextStage');

      await Page.popup('error', { shouldBeVisible: false });
    });
  }

  public async fillPasswordDetails(options: { password?: string; useDefaultPassword?: boolean } = {}): Promise<void> {
    const { password, useDefaultPassword = false } = options;
    const userPassword = useDefaultPassword ? this.DEFAULT_PASSWORD : password ?? '';

    await EventHelper.track('Filling Password Details', async () => {
      await this.setPassword(userPassword);
      await FormNavigatorFooter.navigate('nextStage');

      await Page.popup('info', {
        shouldBeVisible: true,
        shouldDismiss: true,
        buttonText: 'ACCEPT',
      });
    });
  }

  public async fillCommunicationDetails(phoneNumber: string, emailAddress: string): Promise<void> {
    await EventHelper.track('Filling Communication Details', async () => {
      await this.setPhoneNumber(phoneNumber);
      await this.setEmailAddress(emailAddress);
      await FormNavigatorFooter.navigate('nextStage');
    });
  }

  public async fillVerificationCodes(phoneNumber: string, emailAddress: string): Promise<void> {
    await EventHelper.track('Filling Verification Codes', async () => {
      const verificationCodes = await SignUp.getVerificationCodes(phoneNumber, emailAddress);
      await this.setVerificationCodes(verificationCodes);
      await FormNavigatorFooter.navigate('submit');

      await Page.popup('success', {
        shouldBeVisible: true,
        shouldDismiss: true,
        buttonText: 'ENTER',
      });
    });
  }

  private async setUserId(userId: string): Promise<void> {
    const { userIdField, personalDetailsContainerText } = this.signUpSelectors;
    await Page.type(Page.$(userIdField), userId, {
      isDismissKeyboard: { dismissKeyboardTestID: personalDetailsContainerText },
    });
  }

  private async setAuthenticationQuestion(questionNumber: number): Promise<void> {
    const { authenticationQuestionList, authenticationQuestionListOption } = this.signUpSelectors;
    await Page.click(Page.$(authenticationQuestionList));
    await Page.click(Page.$(authenticationQuestionListOption(questionNumber)));
  }

  private async setAuthenticationDate(requestedDate: AuthenticationDate): Promise<void> {
    const { authenticationAnswerField } = this.signUpSelectors;
    const dateField = Page.$(authenticationAnswerField);
    const confirmButtonText = await Page.translate('APPROVE');
    const confirmButton = Page.$(confirmButtonText, { selectorType: 'text' });

    const dateEntries = SignUp.createDatePickerEntries(requestedDate);
    await Page.click(dateField);
    await Page.waitForElementToExist(confirmButton, { shouldExist: true });

    if (await Page.isAndroid()) {
      await SignUp.setAndroidDateValues(dateEntries);
    } else {
      await SignUp.setIOSDateValues(dateEntries);
    }

    await Page.click(confirmButton);
    await Page.waitForElementToExist(confirmButton, { shouldExist: false });
  }

  private static createDatePickerEntries(requestedDate: AuthenticationDate): DatePickerEntry[] {
    const systemDate = new Date();

    return [
      {
        index: 0,
        selectedValue: requestedDate.day,
        currentValue: systemDate.getDate(),
        label: 'Select Date',
      },
      {
        index: 1,
        selectedValue: requestedDate.month,
        currentValue: systemDate.getMonth() + 1,
        label: 'Select Month',
      },
      {
        index: 2,
        selectedValue: requestedDate.year,
        currentValue: systemDate.getFullYear(),
        label: 'Select Year',
      },
    ];
  }

  private static async setAndroidDateValues(dateEntries: DatePickerEntry[]): Promise<void> {
    return await dateEntries.reduce(async (promise, entry) => {
      await promise;
      const picker = Page.$(entry.label, { selectorType: 'label' });
      const swipeOperation = SignUp.calculateSwipeOperation(entry);

      const swipes = Array.from({ length: swipeOperation.count }, (_, i) => i);

      return await swipes.reduce(async (swipePromise) => {
        await swipePromise;
        await picker.indexableNativeElement.swipe(swipeOperation.direction, 'fast', 0.05);
        await Page.sleep(0.1);
      }, Promise.resolve());
    }, Promise.resolve());
  }

  private static calculateSwipeOperation(entry: DatePickerEntry): SwipeOperation {
    if (entry.index === 1) {
      const clockwiseSteps = (entry.selectedValue - entry.currentValue + 12) % 12;
      const counterClockwiseSteps = (entry.currentValue - entry.selectedValue + 12) % 12;

      return clockwiseSteps <= counterClockwiseSteps
        ? { direction: 'up', count: clockwiseSteps }
        : { direction: 'down', count: counterClockwiseSteps };
    }

    const difference = entry.currentValue - entry.selectedValue;

    return {
      direction: difference > 0 ? 'down' : 'up',
      count: Math.abs(difference),
    };
  }

  private static async setIOSDateValues(dateEntries: DatePickerEntry[]): Promise<void> {
    const datePicker = Page.$('UIPickerView', { selectorType: 'type' });

    for (const entry of dateEntries) {
      const displayValue =
        entry.index === 1 ? SignUp.getHebrewMonthName(entry.selectedValue) : entry.selectedValue.toString();
      await datePicker.indexableNativeElement.setColumnToValue(entry.index, displayValue);
    }
  }

  private static getHebrewMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('he', { month: 'long' });
  }

  private async setTermsOfServiceCheckbox(): Promise<void> {
    const { termsOfServiceCheckbox } = this.signUpSelectors;
    await Page.checkbox(Page.$(termsOfServiceCheckbox), true);
  }

  private async setPassword(password: string): Promise<void> {
    const { choosePasswordContainerText, newPasswordField, confirmPasswordField } = this.signUpSelectors;
    const options = {
      isDismissKeyboard: { dismissKeyboardTestID: choosePasswordContainerText },
    };

    await Page.type(Page.$(newPasswordField), password, options);
    await Page.type(Page.$(confirmPasswordField), password, options);
  }

  private async setPhoneNumber(phoneNumber: string): Promise<void> {
    const { communicationDetailsContainerText, phoneNumberField } = this.signUpSelectors;
    await Page.type(Page.$(phoneNumberField), phoneNumber, {
      isDismissKeyboard: { dismissKeyboardTestID: communicationDetailsContainerText },
    });
  }

  private async setEmailAddress(emailAddress: string): Promise<void> {
    const { communicationDetailsContainerText, emailAddressField } = this.signUpSelectors;
    await Page.type(Page.$(emailAddressField), emailAddress, {
      isDismissKeyboard: { dismissKeyboardTestID: communicationDetailsContainerText },
    });
  }

  private static async getVerificationCodes(
    phoneNumber: string,
    emailAddress: string,
  ): Promise<{ phoneCode: string; emailCode: string }> {
    const mongoHelper = await MongoHelper.getInstance();
    const otpObject = await mongoHelper.getOTP(phoneNumber, emailAddress);

    if (SignUp.isValidOTPObject(otpObject)) {
      return otpObject;
    }

    throw new Error('Invalid verification codes received');
  }

  private static isValidOTPObject(obj: any): obj is { phoneCode: string; emailCode: string } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'phoneCode' in obj &&
      'emailCode' in obj &&
      typeof obj.phoneCode === 'string' &&
      typeof obj.emailCode === 'string'
    );
  }

  private async setVerificationCodes(codes: { phoneCode: string; emailCode: string }): Promise<void> {
    const { communicationVerificationContainerText, phoneCodeField, emailCodeField } = this.signUpSelectors;
    const options = {
      isDismissKeyboard: { dismissKeyboardTestID: communicationVerificationContainerText },
    };

    await Page.type(Page.$(phoneCodeField), codes.phoneCode, options);
    await Page.type(Page.$(emailCodeField), codes.emailCode, options);
  }
}

export default new SignUp();
