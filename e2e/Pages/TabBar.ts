import { Control } from '../Core/Control';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

type Tab = 'home' | 'profile';

/** The bottom tab bar shown on every signed-in screen. */
class TabBar extends ScreenObject {
  protected readonly label = 'Tab bar';

  protected readonly rootId = ids.tabs.bar;

  public async open(tab: Tab): Promise<void> {
    await Control.id(ids.tabs[tab]).tap();
  }
}

export const tabBar = new TabBar();
