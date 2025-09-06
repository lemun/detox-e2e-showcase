import { signUpFlow } from '../Flows/SignUpFlow';
import { signInFlow } from '../Flows/SignInFlow';
import { changeCommunicationFlow } from '../Flows/ChangeCommunicationFlow';
import { AppLifecycle } from '../Lifecycle/AppLifecycle';
import { DatabaseLifecycle } from '../Lifecycle/DatabaseLifecycle';
import { Fixtures } from '../Fixtures/Fixtures';

const testUser = Fixtures.getTestUser('deletedUserId');

describe('Pre-Production End-to-End Tests', () => {
  beforeAll(async () => {
    await AppLifecycle.initialize(true);
  });

  afterAll(async () => {
    await AppLifecycle.cleanup();
    await DatabaseLifecycle.cleanup();
  });

  describe('User Registration', () => {
    it('should sign up a new user', async () => {
      await signUpFlow({
        userId: testUser.userId,
      });
    });
  });

  describe('User Authentication', () => {
    it('should sign in with valid credentials', async () => {
      await signInFlow({
        userId: testUser.userId,
        rememberMe: true,
      });
    });
  });

  describe('User Phone Communication Number', () => {
    it('should change communication details', async () => {
      await changeCommunicationFlow({
        communicationOption: 'phoneNumber',
      });
    });
  });

  describe('User Email Communication Address', () => {
    it('should change communication details', async () => {
      await changeCommunicationFlow({
        communicationOption: 'email',
      });
    });
  });
});
