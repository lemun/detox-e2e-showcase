export type NativeElement = {
  readonly indexableNativeElement: Detox.IndexableNativeElement;
  readonly testID: string;
};

export type PopupType = 'error' | 'info' | 'warning' | 'success' | 'retry';

export type AuthenticationDate = {
  readonly day: number;
  readonly month: number;
  readonly year: number;
};

export interface NavigationDestination {
  readonly [key: string]: string;
}
