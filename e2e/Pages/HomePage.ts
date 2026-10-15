import { Control } from '../Core/Control';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

class HomePage extends ScreenObject {
  protected readonly label = 'Home';

  protected readonly rootId = ids.home.screen;

  public async greeting(): Promise<string> {
    return await Control.id(ids.home.greeting).readText();
  }
}

export const homePage = new HomePage();
