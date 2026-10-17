/**
 * Every testID the suite uses, grouped by screen. The app names them `screen.element`. Pages take
 * ids from here only, so renaming one in the app is a one-line change here.
 */

export type DialogKind = 'success' | 'error' | 'info';

export const ids = {
  header: {
    back: 'header.back-button',
  },
  loading: 'loading-overlay',
  dialog: {
    root: 'dialog',
    kind: (kind: DialogKind) => `dialog.kind.${kind}`,
    title: 'dialog.title',
    button: 'dialog.primary-button',
  },
  tabs: {
    bar: 'tab-bar',
    home: 'tab-bar.home-tab',
    profile: 'tab-bar.profile-tab',
  },
  welcome: {
    screen: 'welcome.screen',
    createAccount: 'welcome.sign-up-button',
    signIn: 'welcome.sign-in-button',
  },
  signIn: {
    screen: 'sign-in.screen',
    title: 'sign-in.title',
    email: 'sign-in.email-input',
    password: 'sign-in.password-input',
    submit: 'sign-in.submit-button',
  },
  signUp: {
    screen: 'sign-up.screen',
    detailsStep: 'sign-up.step.details',
    detailsTitle: 'sign-up.details-title',
    name: 'sign-up.name-input',
    email: 'sign-up.email-input',
    emailError: 'sign-up.email-input.error',
    password: 'sign-up.password-input',
    passwordError: 'sign-up.password-input.error',
    terms: 'sign-up.terms-toggle',
    next: 'sign-up.next-button',
    codeStep: 'sign-up.step.verify',
    codeTitle: 'sign-up.verify-title',
    code: 'sign-up.code-input',
    create: 'sign-up.create-button',
  },
  home: {
    screen: 'home.screen',
    greeting: 'home.greeting',
  },
  profile: {
    screen: 'profile.screen',
    name: 'profile.name',
    email: 'profile.email',
    notifications: 'profile.preferences-button',
    signOut: 'profile.sign-out-button',
  },
  notifications: {
    screen: 'preferences.screen',
    title: 'preferences.title',
    productUpdates: 'preferences.product-updates-toggle',
    weeklyDigest: 'preferences.weekly-digest-toggle',
    reminders: 'preferences.reminders-toggle',
    save: 'preferences.save-button',
  },
} as const;
