export const SignUp = {
  containerView: 'signUpFormWrapper:view.container',

  personalDetailsContainerText: 'personalDetails:text.title',
  choosePasswordContainerText: 'password:text.title',
  communicationDetailsContainerText: 'communicationDetails:text.title',
  communicationVerificationContainerText: 'communicationVerification:text.title',

  userIdField: 'personalDetails:field.userId',
  authenticationAnswerField: 'personalDetails:field.authenticationAnswer',
  newPasswordField: 'choosePassword:field.newPassword',
  confirmPasswordField: 'choosePassword:field.confirmPassword',
  phoneNumberField: 'communicationDetails:field.phoneNumber',
  emailAddressField: 'communicationDetails:field.emailAddress',
  phoneCodeField: 'communicationVerification:field.phoneVerificationCode',
  emailCodeField: 'communicationVerification:field.emailVerificationCode',

  nextStageButton: 'formNavigatorFooter:button.nextStage',
  submitButton: 'formNavigatorFooter:button.submit',

  termsOfServiceCheckbox: 'personalDetails:checkbox.theTermsOfService',

  authenticationQuestionList: 'personalDetails:field.authenticationQuestion',
  authenticationQuestionListOption: (option: number) => `personalDetails:authenticationQuestListItem.option-${option}`,
};
