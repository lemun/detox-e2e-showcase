import fixturesData from './fixturesData.json';
import { generateRandomCommunicationDetails } from './utils';

export namespace Fixtures {
  export type TestUserKey = keyof typeof fixturesData;

  export function getTestUser(key: TestUserKey): { userId: string } {
    const userData = fixturesData[key];

    if (!userData) {
      throw new Error(`Test data not found for key: ${key}`);
    }

    return userData;
  }
}

export { generateRandomCommunicationDetails };
