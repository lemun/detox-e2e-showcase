import { ids, type DialogKind } from '../Selectors/TestIds';
import { Control } from './Control';
import { step } from './Steps';

/**
 * The sample app shows results in one dialog with a kind (success, error, info), a title and a
 * single button. This checks the kind and title, presses the button, and waits for the dialog to
 * close, so the next step starts on a clear screen.
 */
export async function acknowledgeDialog(kind: DialogKind, title: string): Promise<void> {
  const dialog = Control.id(ids.dialog.root);

  await step(`acknowledge ${kind} dialog "${title}"`, async () => {
    await dialog.appears();
    await Control.id(ids.dialog.kind(kind)).appears();
    await Control.id(ids.dialog.title).expectText(title);
    await Control.id(ids.dialog.button).tap();
    await dialog.disappears();
  });
}
