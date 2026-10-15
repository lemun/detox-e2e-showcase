import type { Preferences } from '../Model';
import { notificationsPage } from '../Pages/NotificationsPage';
import { profilePage } from '../Pages/ProfilePage';
import { tabBar } from '../Pages/TabBar';
import { defineFlow } from './DefineFlow';

/** From any signed-in screen: Profile -> Notifications -> change switches -> Save -> back to Profile. */
export const changeNotifications = defineFlow(
  (changes: Partial<Preferences>) => `Change notifications (${Object.keys(changes).join(', ')})`,
  async (changes) => {
    if (Object.keys(changes).length === 0) {
      throw new Error('changeNotifications needs at least one setting to change');
    }

    await tabBar.open('profile');
    await profilePage.waitUntilOpen();
    await profilePage.openNotifications();
    await notificationsPage.waitUntilOpen();
    await notificationsPage.apply(changes);
    await notificationsPage.save();
    await notificationsPage.goBack();
    await profilePage.waitUntilOpen();
  },
);
