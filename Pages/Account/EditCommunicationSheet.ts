import Page from '../Page';
import { MongoHelper } from '../../Helpers/MongoHelper';
import { EventHelper } from '../../Helpers/EventHelper';
import AccountArea from './AccountArea';

class EditCommunicationSheet extends Page {
  private editCommunicationSheetSelectors = Page.selectors.account.editCommunication;

  private validateCodeSelectors = Page.selectors.auth.validateCode;

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.editCommunicationSheetSelectors;
    await Page.waitForLoad(containerView);
  }

  public async openEditCommunication(): Promise<void> {
    await AccountArea.navigate('editCommunication');
    await this.waitForLoad();
  }

  public async closeEditCommunication(): Promise<void> {
    const { containerView } = this.editCommunicationSheetSelectors;
    const containerElement = Page.$(containerView).indexableNativeElement;
    await containerElement.longPressAndDrag(500, 0.5, 0.05, containerElement, 0.5, 0.95, 'fast', 0);
    await Page.waitForElementToBeVisible(Page.$(containerView), { shouldBeVisible: false });
  }

  public async selectCommunicationOption(optionNumber: number): Promise<void> {
    const { editCommunicationOptions } = this.editCommunicationSheetSelectors;
    const optionElement = Page.$(editCommunicationOptions(optionNumber));
    await Page.click(optionElement);
  }

  public async fillCommunicationDetails(inputValue: string): Promise<void> {
    const { editCommunicationPhoneNumberField, editCommunicationEmailField, containerView } =
      this.editCommunicationSheetSelectors;
    const isPhoneNumber = /^05\d{8}$/.test(inputValue.trim());
    const fieldSelector = isPhoneNumber ? editCommunicationPhoneNumberField : editCommunicationEmailField;
    const fieldElement = Page.$(fieldSelector);

    if (!isPhoneNumber && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      EventHelper.message(inputValue, 'debug');

      throw new Error('Invalid email format');
    }

    await Page.type(fieldElement, inputValue, {
      isDismissKeyboard: { dismissKeyboardTestID: containerView },
    });
  }

  private static async getVerificationCode(communicationOptionValue: string): Promise<string> {
    const isPhoneNumber = /^\+?[\d\s-]{10,14}$/.test(communicationOptionValue.trim());
    const mongoHelper = await MongoHelper.getInstance();
    const verificationCodes = await mongoHelper.getOTP(
      isPhoneNumber ? communicationOptionValue : undefined,
      isPhoneNumber ? undefined : communicationOptionValue,
    );

    if (!verificationCodes) {
      throw new Error('Failed to retrieve OTP');
    }

    const otpCode = isPhoneNumber ? verificationCodes.phoneCode : verificationCodes.emailCode;

    if (!otpCode) {
      throw new Error(`No OTP found for ${isPhoneNumber ? 'phone number' : 'email'}`);
    }

    return otpCode;
  }

  public async setVerificationOtpCode(communicationOptionValue: string): Promise<void> {
    const { containerView } = this.editCommunicationSheetSelectors;
    const { verificationCodeField, submitButton } = this.validateCodeSelectors;

    const otpCode = await EditCommunicationSheet.getVerificationCode(communicationOptionValue);
    const fieldElement = Page.$(verificationCodeField);
    const buttonElement = Page.$(submitButton);

    await Page.type(fieldElement, otpCode, {
      isDismissKeyboard: { dismissKeyboardTestID: containerView },
    });
    await Page.click(buttonElement);

    await Page.popup('success', {
      shouldBeVisible: true,
      shouldDismiss: true,
      buttonText: await Page.translate('BACK_TO_ACCOUNT_PAGE'),
    });

    await Page.popup('error', { shouldBeVisible: false });
  }

  public async submitForm(): Promise<void> {
    const { continueButton } = this.editCommunicationSheetSelectors;
    const buttonElement = Page.$(continueButton);
    await Page.click(buttonElement, { isWaitNotToExist: true });
  }
}

export default new EditCommunicationSheet();
