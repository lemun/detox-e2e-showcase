import { EventHelper } from '../Helpers/EventHelper';
import { FlowOptions } from './types';
import LandingScreen from '../Pages/Auth/LandingScreen';
import SignUp from '../Pages/Auth/SignUp';
import { generateRandomCommunicationDetails } from '../Fixtures/Fixtures';

interface SignUpParams {
  userId: string;
}

const SignUpOptions: FlowOptions = {
  setup: async () => await LandingScreen.waitForLoad(),
};

export async function signUpFlow(params: SignUpParams, options: FlowOptions = SignUpOptions): Promise<void> {
  try {
    const { setup } = options;

    if (setup) {
      await EventHelper.track('Setup', setup);
    }

    await EventHelper.track('Sign Up Flow', async () => {
      if (!params?.userId) {
        throw new Error('User ID is required for sign up');
      }

      const communicationDetails = generateRandomCommunicationDetails();

      await LandingScreen.navigate('signUp');
      await SignUp.waitForLoad();

      await EventHelper.track('Personal Details', async () => {
        await SignUp.fillPersonalDetails(params.userId, 3, {
          day: 1,
          month: 1,
          year: 1999,
        });
      });

      await EventHelper.track('Password Details', async () => {
        await SignUp.fillPasswordDetails({ useDefaultPassword: true });
      });

      await EventHelper.track('Communication Details', async () => {
        await SignUp.fillCommunicationDetails(communicationDetails.phoneNumber, communicationDetails.email);
      });

      await EventHelper.track('Verification', async () => {
        await SignUp.fillVerificationCodes(communicationDetails.phoneNumber, communicationDetails.email);
      });
    });
  } finally {
    const { teardown } = options;

    if (teardown) {
      await EventHelper.track('Teardown', teardown);
    }
  }
}
