import { describe, expect, it } from '@jest/globals';
import { acknowledgeDialog } from '../Core/Dialog';
import { testApi } from '../Data/TestApi';
import { newPerson, people, seededPeople } from '../Fixtures/People';
import { createAccount } from '../Flows/CreateAccount';
import { prepareSuite } from '../Lifecycle/Harness';
import { homePage } from '../Pages/HomePage';
import { signUpPage } from '../Pages/SignUpPage';
import { welcomePage } from '../Pages/WelcomePage';

describe('New account', () => {
  prepareSuite(seededPeople);

  it('creates an account with the emailed code and lands on Home', async () => {
    const sam = newPerson();

    await createAccount(sam);

    expect(await homePage.greeting()).toBe(`Hello, ${sam.name}`);
    expect(await testApi.account(sam.email)).toMatchObject({ email: sam.email, verified: true });
  });

  it('flags an invalid email before any code is sent', async () => {
    await welcomePage.waitUntilOpen();
    await welcomePage.chooseCreateAccount();
    await signUpPage.waitUntilOpen();
    await signUpPage.enterDetails({ ...newPerson(), email: 'not-an-email' });
    await signUpPage.requestCode();

    await signUpPage.expectFieldError('email', 'Enter a valid email address');
    await signUpPage.waitUntilOpen();
  });

  it('refuses an email that already has an account', async () => {
    await welcomePage.waitUntilOpen();
    await welcomePage.chooseCreateAccount();
    await signUpPage.waitUntilOpen();
    await signUpPage.enterDetails({ ...newPerson(), email: people.avery.email });
    await signUpPage.requestCode();

    await acknowledgeDialog('error', 'Could not create account');
    await signUpPage.waitUntilOpen();
  });
});
