import { EventHelper } from '../Helpers/EventHelper';
import { FlowOptions } from './types';
import LandingScreen from '../Pages/Auth/LandingScreen';
import BottomTabsNavigator from '../Pages/Navigators/BottomTabsNavigator';
import AccountArea from '../Pages/Account/AccountArea';
import EditCommunicationSheet from '../Pages/Account/EditCommunicationSheet';
import { generateRandomCommunicationDetails } from '../Fixtures/Fixtures';

interface CommunicationParams {
  communicationOption: 'phoneNumber' | 'email';
}

const CommunicationOptions: FlowOptions = {
  setup: async () => await LandingScreen.waitForLoad(),
};

export async function changeCommunicationFlow(
  params: CommunicationParams,
  options: FlowOptions = CommunicationOptions,
): Promise<void> {
  try {
    const { setup } = options;

    if (setup) {
      await EventHelper.track('Setup', setup);
    }

    await EventHelper.track('Change Communication Flow', async () => {
      if (!params?.communicationOption) {
        throw new Error('Communication option is required');
      }

      if (!['phoneNumber', 'email'].includes(params.communicationOption)) {
        throw new Error('Invalid communication option. Must be either "phoneNumber" or "email"');
      }

      const randomDetails = generateRandomCommunicationDetails();
      const newDetail = params.communicationOption === 'phoneNumber' ? randomDetails.phoneNumber : randomDetails.email;

      await EventHelper.track('Navigate to Account', async () => {
        await BottomTabsNavigator.navigate('account');
        await AccountArea.waitForLoad();
      });

      await EventHelper.track('Update Communication', async () => {
        await EditCommunicationSheet.openEditCommunication();

        await EditCommunicationSheet.selectCommunicationOption(params.communicationOption === 'email' ? 1 : 2);

        await EditCommunicationSheet.fillCommunicationDetails(newDetail);

        await EditCommunicationSheet.submitForm();

        await EditCommunicationSheet.setVerificationOtpCode(newDetail);
      });
    });
  } finally {
    const { teardown } = options;

    if (teardown) {
      await EventHelper.track('Teardown', teardown);
    }
  }
}
