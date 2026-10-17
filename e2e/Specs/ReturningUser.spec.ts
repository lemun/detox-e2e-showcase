import { describe, expect, it } from '@jest/globals';
import { acknowledgeDialog } from '../Core/Dialog';
import { testApi } from '../Data/TestApi';
import { people, seededPeople } from '../Fixtures/People';
import { changeNotifications } from '../Flows/ChangeNotifications';
import { signInAs } from '../Flows/SignIn';
import { signOut } from '../Flows/SignOut';
import { prepareSuite } from '../Lifecycle/Harness';
import { homePage } from '../Pages/HomePage';
import { profilePage } from '../Pages/ProfilePage';
import { signInPage } from '../Pages/SignInPage';
import { tabBar } from '../Pages/TabBar';
import { welcomePage } from '../Pages/WelcomePage';

describe('Returning user', () => {
  prepareSuite(seededPeople);

  it('signs in and is greeted by name', async () => {
    await signInAs(people.avery);

    expect(await homePage.greeting()).toBe(`Hello, ${people.avery.name}`);
  });

  it('stays on the sign-in screen with an error when the password is wrong', async () => {
    await welcomePage.waitUntilOpen();
    await welcomePage.chooseSignIn();
    await signInPage.waitUntilOpen();
    await signInPage.enterCredentials(people.avery.email, 'not-the-password');
    await signInPage.submit();

    await acknowledgeDialog('error', 'Sign-in failed');
    await signInPage.waitUntilOpen();
  });

  it('changes notification settings and the backend stores them', async () => {
    // Jordan starts with the weekly digest on (see Fixtures/People.ts).
    await signInAs(people.jordan);
    await changeNotifications({ weeklyDigest: false, reminders: true });

    const stored = await testApi.account(people.jordan.email);
    expect(stored.preferences).toEqual({ productUpdates: true, weeklyDigest: false, reminders: true });
  });

  it('sees their own email on Profile and signs out', async () => {
    await signInAs(people.avery);
    await tabBar.open('profile');
    await profilePage.waitUntilOpen();

    expect(await profilePage.email()).toBe(people.avery.email);

    await signOut();
  });
});
