import { AccountArea } from './Account/AccountArea';
import { EditCommunication } from './Account/EditCommunication';
import { LandingScreen } from './Auth/LandingScreen';
import { SignIn } from './Auth/SignIn';
import { SignUp } from './Auth/SignUp';
import { ValidateCode } from './Auth/ValidateCode';
import { Components } from './Components/Components';
import { Home } from './Home/Home';
import { Navigators } from './Navigators/Navigators';

export const Selectors = {
  account: {
    accountArea: AccountArea,
    editCommunication: EditCommunication,
  },
  auth: {
    landingScreen: LandingScreen,
    signIn: SignIn,
    signUp: SignUp,
    validateCode: ValidateCode,
  },
  components: Components,
  home: Home,
  navigators: Navigators,
};

export default Selectors;
