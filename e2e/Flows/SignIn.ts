import type { Person } from '../Model';
import { homePage } from '../Pages/HomePage';
import { signInPage } from '../Pages/SignInPage';
import { welcomePage } from '../Pages/WelcomePage';
import { defineFlow } from './DefineFlow';

/** Welcome -> Sign in -> Home. */
export const signInAs = defineFlow(
  (person: Person) => `Sign in as ${person.email}`,
  async (person) => {
    await welcomePage.waitUntilOpen();
    await welcomePage.chooseSignIn();
    await signInPage.waitUntilOpen();
    await signInPage.enterCredentials(person.email, person.password);
    await signInPage.submit();
    await homePage.waitUntilOpen();
  },
);
