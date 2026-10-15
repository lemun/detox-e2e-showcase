import { Control } from '../Core/Control';
import { step } from '../Core/Steps';
import { ids } from '../Selectors/TestIds';

/**
 * Base for page objects. A page says which view proves it is open and offers actions in the app's
 * words ("enter credentials", "open notifications"). How to wait, tap or type lives in Control, so
 * pages hold only what is specific to their screen.
 */
export abstract class ScreenObject {
  /** Used in the step log ("Sign-in screen is open"). */
  protected abstract readonly label: string;

  /** The root view of the screen. */
  protected abstract readonly rootId: string;

  /** Views that must also be visible before the screen counts as ready, such as data loaded from the backend. */
  protected readonly readyIds: readonly string[] = [];

  public async waitUntilOpen(): Promise<void> {
    await step(`${this.label} is open`, async () => {
      for (const id of [this.rootId, ...this.readyIds]) {
        await Control.id(id).appears();
      }
    });
  }

  /** The header's back button. The sample app is iOS-only, so there is no system back to fall back on. */
  public async goBack(): Promise<void> {
    await Control.id(ids.header.back).tap();
  }

  /** Typing leaves the keyboard up over the lower half of the screen; tapping a plain view closes it. */
  protected async closeKeyboard(byTapping: string): Promise<void> {
    await Control.id(byTapping).tap();
  }
}
