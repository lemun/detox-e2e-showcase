import { profilePage } from '../Pages/ProfilePage';
import { tabBar } from '../Pages/TabBar';
import { welcomePage } from '../Pages/WelcomePage';
import { defineFlow } from './DefineFlow';

/** From any signed-in screen: Profile -> Sign out -> Welcome. */
export const signOut = defineFlow(
  () => 'Sign out',
  async () => {
    await tabBar.open('profile');
    await profilePage.waitUntilOpen();
    await profilePage.signOut();
    await welcomePage.waitUntilOpen();
  },
);
