const PHONE_NUMBER_PREFIX = '0554';
const EMAIL_ADDRESS_PREFIX = 'testing';
const EMAIL_DOMAIN = '@example.com';
const DIGITS_LENGTH = 6;

interface CommunicationDetails {
  phoneNumber: string;
  email: string;
}

const generateRandomDigits = (): string => {
  return Math.floor(Math.random() * 10 ** DIGITS_LENGTH)
    .toString()
    .padStart(DIGITS_LENGTH, '0');
};

export function generateRandomCommunicationDetails(): CommunicationDetails {
  const randomDigits = generateRandomDigits();

  return {
    phoneNumber: `${PHONE_NUMBER_PREFIX}${randomDigits}`,
    email: `${EMAIL_ADDRESS_PREFIX}${randomDigits}${EMAIL_DOMAIN}`,
  };
}
