export const AuthenticationQuestions = {
  EXPIRY_DATE: 1,
  VERIFICATION_DATE: 2,
  DATE_OF_BIRTH: 3,
} as const;

export const DEFAULT_TIMEOUT = Number(process.env.TEST_TIMEOUT ?? 12000);

export const CommunicationOptions = {
  EMAIL_ADDRESS: 1,
  PHONE_NUMBER: 2,
} as const;

export const PopupTypes = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  RETRY: 'retry',
} as const;
