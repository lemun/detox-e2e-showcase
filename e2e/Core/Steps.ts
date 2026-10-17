import { log } from 'detox';

/**
 * The suite's step log. Everything the suite does runs inside step(): flows, page actions and
 * single taps. Parent steps print a header when their first child starts, every step prints one
 * result line with its duration, and the indentation follows the nesting.
 *
 * A failing step also prefixes the error message with the path of steps that led to it, for example
 * "[Sign in as avery@example.com > tap sign-in.submit-button] ...". The Jest report then names the
 * exact place in the journey, without reading the whole log.
 */

interface OpenStep {
  readonly title: string;
  readonly startedAt: number;
  headerPrinted: boolean;
}

const open: OpenStep[] = [];
const withPath = new WeakSet<Error>();

function indent(depth: number): string {
  return '  '.repeat(depth);
}

function since(startedAt: number): string {
  return `${Math.round(performance.now() - startedAt)} ms`;
}

/** Prints the header of every enclosing step that has not printed one yet. */
function printHeaders(): void {
  open.forEach((frame, depth) => {
    if (!frame.headerPrinted) {
      log.info(`${indent(depth)}› ${frame.title}`);
      frame.headerPrinted = true;
    }
  });
}

function addPath(error: unknown, path: string): unknown {
  if (error instanceof Error && !withPath.has(error)) {
    error.message = `[${path}] ${error.message}`;
    withPath.add(error);
  }

  return error;
}

export async function step<T>(title: string, body: () => Promise<T>): Promise<T> {
  printHeaders();
  const depth = open.length;
  const frame: OpenStep = { title, startedAt: performance.now(), headerPrinted: false };
  open.push(frame);

  try {
    const result = await body();
    log.info(`${indent(depth)}✔ ${title} · ${since(frame.startedAt)}`);

    return result;
  } catch (error) {
    log.error(`${indent(depth)}✘ ${title} · ${since(frame.startedAt)}`);

    throw addPath(error, open.map((entry) => entry.title).join(' > '));
  } finally {
    open.pop();
  }
}

/** A line of context inside the current step (never pass secrets: the log is kept as an artifact). */
export function note(text: string): void {
  printHeaders();
  log.info(`${indent(open.length)}· ${text}`);
}
