import { EventHelper } from '../Helpers/EventHelper';
import { FlowOptions } from './types';
import LandingScreen from '../Pages/Auth/LandingScreen';
import { AppLifecycle } from '../Lifecycle/AppLifecycle';
import SignIn from '../Pages/Auth/SignIn';
import Home from '../Pages/Home/Home';

interface SignInParams {
  userId: string;
  rememberMe?: boolean;
}

const SignInOptions: FlowOptions = {
  setup: async () => await LandingScreen.waitForLoad(),
  teardown: async () => await AppLifecycle.reload(),
};

export async function signInFlow(params: SignInParams, options: FlowOptions = SignInOptions): Promise<void> {
  try {
    const { setup } = options;

    if (setup) {
      await EventHelper.track('Setup', setup);
    }

    await EventHelper.track('Sign In Flow', async () => {
      if (!params?.userId) {
        throw new Error('User ID is required for sign in');
      }

      await LandingScreen.navigate('signIn');
      await SignIn.waitForLoad();
      await SignIn.fillSignInDetails({
        userId: params.userId,
        rememberMe: params.rememberMe,
      });

      try {
        await Home.waitForLoad();
      } catch (error) {
        throw new Error('Sign in failed - user not signed in after completion');
      }
    });
  } finally {
    const { teardown } = options;

    if (teardown) {
      await EventHelper.track('Teardown', teardown);
    }
  }
}
