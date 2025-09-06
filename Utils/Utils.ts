import { ElementInteractions } from './ElementInteractions';
import { DeviceUtils } from './DeviceUtils';
import { NavigationUtils } from './NavigationUtils';
import { PopupUtils } from './PopupUtils';
import { DEFAULT_TIMEOUT } from '../Common/Consts';

export type {
  NativeElement,
  PopupType,
  AuthenticationDate,
  NavigationDestination,
} from '../Common/Types';

export type {
  SelectorTypes,
  SelectorOptions,
  ElementOptions,
  WaitForOptions,
  PopupOptions,
  SignInParams,
  SignUpParams,
} from '../Common/Interfaces';

export { AuthenticationQuestions, DEFAULT_TIMEOUT, CommunicationOptions, PopupTypes } from '../Common/Consts';

export const TestUtils = {
  Elements: ElementInteractions,
  Device: DeviceUtils,
  Navigation: NavigationUtils,
  Popup: PopupUtils,
} as const;

export const DefaultConfig = {
  timeout: DEFAULT_TIMEOUT,
  popupDismissText: 'DISMISS',
} as const;
