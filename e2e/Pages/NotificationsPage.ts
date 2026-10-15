import { Control } from '../Core/Control';
import { acknowledgeDialog } from '../Core/Dialog';
import type { Preferences } from '../Model';
import { ids } from '../Selectors/TestIds';
import { ScreenObject } from './ScreenObject';

const switchIds: Record<keyof Preferences, string> = {
  productUpdates: ids.notifications.productUpdates,
  weeklyDigest: ids.notifications.weeklyDigest,
  reminders: ids.notifications.reminders,
};

class NotificationsPage extends ScreenObject {
  protected readonly label = 'Notifications screen';

  protected readonly rootId = ids.notifications.screen;

  /** The switches and Save render once the current settings arrive from the backend. */
  protected override readonly readyIds = [ids.notifications.save];

  public async apply(changes: Partial<Preferences>): Promise<void> {
    for (const key of Object.keys(changes) as (keyof Preferences)[]) {
      const on = changes[key];

      if (on !== undefined) {
        await Control.id(switchIds[key]).switchTo(on);
      }
    }
  }

  public async save(): Promise<void> {
    await Control.id(ids.notifications.save).tap();
    await acknowledgeDialog('success', 'Preferences saved');
  }
}

export const notificationsPage = new NotificationsPage();
