import { acknowledgeDialog } from '../Core/Dialog';
import { note } from '../Core/Steps';
import { testApi } from '../Data/TestApi';
import type { Person } from '../Model';
import { homePage } from '../Pages/HomePage';
import { signUpPage } from '../Pages/SignUpPage';
import { welcomePage } from '../Pages/WelcomePage';
import { defineFlow } from './DefineFlow';

/**
 * Welcome -> details -> code -> Home. The code is read from the backend, the way a person would
 * read it from their inbox.
 */
export const createAccount = defineFlow(
  (person: Person) => `Create an account for ${person.email}`,
  async (person) => {
    await welcomePage.waitUntilOpen();
    await welcomePage.chooseCreateAccount();
    await signUpPage.waitUntilOpen();
    await signUpPage.enterDetails(person);
    await signUpPage.requestCode();
    await signUpPage.waitForCodeStep();

    const code = await testApi.latestCode(person.email);
    note('read the emailed code through the test API');

    await signUpPage.enterCode(code);
    await signUpPage.createAccount();
    await acknowledgeDialog('success', 'Account created');
    await homePage.waitUntilOpen();
  },
);
