import { step } from '../Core/Steps';

/**
 * A flow is a user journey built from page actions. defineFlow gives it a name for the step log;
 * the name can use the arguments, so the log says whose journey it was.
 */
export function defineFlow<Args extends unknown[]>(
  name: (...args: Args) => string,
  journey: (...args: Args) => Promise<void>,
): (...args: Args) => Promise<void> {
  return async (...args: Args) => {
    await step(name(...args), async () => {
      await journey(...args);
    });
  };
}
