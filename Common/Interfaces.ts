import { NativeMatcher } from 'detox/detox';
import { AuthenticationDate } from './Types';

export interface SelectorTypes {
  id(id: string | RegExp): NativeMatcher;
  text(text: string | RegExp): NativeMatcher;
  label(label: string | RegExp): NativeMatcher;
  type(nativeViewType: string): NativeMatcher;
  traits(traits: string[]): NativeMatcher;
}

export interface SelectorOptions {
  readonly isSelector?: boolean;
  readonly selectorType?: keyof SelectorTypes | 'id';
}

export interface ElementOptions {
  readonly isWaitNotToExist?: boolean;
  readonly timeout?: number;
  readonly isDismissKeyboard?: {
    readonly dismissKeyboardTestID: string;
  };
  readonly isButton?: boolean;
}

export interface WaitForOptions {
  readonly shouldExist?: boolean;
  readonly shouldBeVisible?: boolean;
  readonly shouldIgnoreError?: boolean;
  readonly timeout?: number;
}

export interface PopupOptions {
  readonly shouldBeVisible?: boolean;
  readonly errorMessage?: string;
  readonly shouldDismiss?: boolean;
  readonly buttonText?: string;
}

export interface SignInParams {
  readonly userId: string;
  readonly password?: string;
  readonly rememberMe?: boolean;
}

export interface SignUpParams {
  readonly userId: string;
  readonly authQuestion?: number;
  readonly authDate?: AuthenticationDate;
  readonly useDefaultPassword?: boolean;
  readonly password?: string;
}
