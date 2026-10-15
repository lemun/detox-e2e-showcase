import type { DialogState } from '../components/Dialog';

export interface ScreenContext {
  /** Runs an async action behind the loading overlay and turns thrown errors into an error dialog. */
  readonly run: (action: () => Promise<void>, errorTitle: string) => void;
  readonly showDialog: (dialog: DialogState) => void;
}
