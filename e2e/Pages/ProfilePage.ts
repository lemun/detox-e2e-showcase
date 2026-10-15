import { Control } from '../Core/Control';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

class ProfilePage extends ScreenObject {
  protected readonly label = 'Profile';

  protected readonly rootId = ids.profile.screen;

  protected override readonly readyIds = [ids.profile.email];

  public async email(): Promise<string> {
    return await Control.id(ids.profile.email).readText();
  }

  public async openNotifications(): Promise<void> {
    await Control.id(ids.profile.notifications).tap();
  }

  public async signOut(): Promise<void> {
    await Control.id(ids.profile.signOut).tap();
  }
}

export const profilePage = new ProfilePage();
