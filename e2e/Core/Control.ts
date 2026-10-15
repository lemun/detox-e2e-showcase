import { by, element, expect as expectView, waitFor } from 'detox';
import { config } from '../Config';
import { step } from './Steps';

const ENABLED_POLL_MS = 200;

async function pause(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * One view on screen, found by testID (or by its text). Pages create controls from the ids in
 * Selectors and call verbs on them. Each verb first waits for the state it needs (visible, enabled)
 * and runs as a logged step, so pages never deal with Detox waits themselves.
 */
export class Control {
  private constructor(
    public readonly name: string,
    private readonly matcher: Detox.NativeMatcher,
  ) {}

  public static id(testID: string): Control {
    return new Control(testID, by.id(testID));
  }

  public static text(text: string): Control {
    return new Control(`"${text}"`, by.text(text));
  }

  private get view(): Detox.NativeElement {
    return element(this.matcher);
  }

  public async appears(timeoutMs: number = config.waitMs): Promise<void> {
    await step(`see ${this.name}`, async () => {
      await waitFor(this.view).toBeVisible().withTimeout(timeoutMs);
    });
  }

  public async disappears(timeoutMs: number = config.waitMs): Promise<void> {
    await step(`${this.name} goes away`, async () => {
      await waitFor(this.view).not.toExist().withTimeout(timeoutMs);
    });
  }

  /** Taps once the view is visible and enabled (a disabled button is polled until it enables). */
  public async tap(): Promise<void> {
    await step(`tap ${this.name}`, async () => {
      await this.waitUntilUsable();
      await this.view.tap();
    });
  }

  /** Replaces the input's text. The value is not logged, since it may be a password or a code. */
  public async fill(value: string): Promise<void> {
    await step(`type into ${this.name}`, async () => {
      await waitFor(this.view).toBeVisible().withTimeout(config.waitMs);
      await this.view.clearText();
      await this.view.typeText(value);
    });
  }

  /** For a Switch: taps only when it is not already in the wanted position, then checks it moved. */
  public async switchTo(on: boolean): Promise<void> {
    await step(`switch ${this.name} ${on ? 'on' : 'off'}`, async () => {
      await waitFor(this.view).toBeVisible().withTimeout(config.waitMs);

      if (await this.isSwitchedTo(on)) {
        return;
      }

      await this.view.tap();
      await expectView(this.view).toHaveToggleValue(on);
    });
  }

  public async expectText(text: string): Promise<void> {
    await step(`${this.name} reads "${text}"`, async () => {
      await expectView(this.view).toHaveText(text);
    });
  }

  public async readText(): Promise<string> {
    const attributes = await this.view.getAttributes();

    if (!('text' in attributes) || typeof attributes.text !== 'string') {
      throw new Error(`${this.name} has no text (or matches more than one view)`);
    }

    return attributes.text;
  }

  private async isSwitchedTo(on: boolean): Promise<boolean> {
    return await expectView(this.view)
      .toHaveToggleValue(on)
      .then(
        () => true,
        () => false,
      );
  }

  private async isEnabled(): Promise<boolean> {
    const attributes = await this.view.getAttributes();

    return !('enabled' in attributes) || attributes.enabled;
  }

  private async waitUntilUsable(): Promise<void> {
    await waitFor(this.view).toBeVisible().withTimeout(config.waitMs);
    const giveUpAt = Date.now() + config.waitMs;

    while (!(await this.isEnabled())) {
      if (Date.now() > giveUpAt) {
        throw new Error(`${this.name} stayed disabled for ${config.waitMs} ms`);
      }

      await pause(ENABLED_POLL_MS);
    }
  }
}
