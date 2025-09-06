import { log } from 'detox';
import { performance } from 'perf_hooks';

type LogType = 'debug' | 'info' | 'warn' | 'error';

interface EventOptions {
  showSuccessMessage?: boolean;
  showErrorTrace?: boolean;
  timeoutMs?: number;
  tags?: string[];
  logType?: LogType;
}

interface EventRecord {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  succeeded: boolean;
  error?: string;
}

export class EventHelper {
  private static readonly Symbols = {
    begin: '▶',
    success: '✓',
    failure: '✗',
    info: 'ℹ',
    debug: '🔍',
    warning: '⚠',
  } as const;

  private static depth = 0;

  private static readonly indent = '  ';

  private static readonly maxHistory = 1000;

  private static history: EventRecord[] = [];

  public static async track<T>(description: string, action: () => Promise<T>, options: EventOptions = {}): Promise<T> {
    const { showSuccessMessage = false, showErrorTrace = true, timeoutMs, tags = [], logType = 'info' } = options;

    const start = performance.now();
    const record = this.createEventRecord(description, start);

    try {
      this.log(logType, `${this.getIndent()}${this.Symbols.begin} ${description}${this.formatTags(tags)}`);
      this.depth += 1;

      const result = timeoutMs ? await this.withTimeout(action(), timeoutMs, description) : await action();

      this.depth -= 1;
      record.succeeded = true;
      record.endTime = performance.now();
      record.duration = record.endTime - record.startTime;

      if (showSuccessMessage) {
        this.log(
          logType,
          `${this.getIndent()}${this.Symbols.success} ${description} completed (${this.formatDuration(start)})`,
        );
      }

      this.saveRecord(record);

      return result;
    } catch (error) {
      this.depth -= 1;
      record.succeeded = false;
      record.endTime = performance.now();
      record.duration = record.endTime - record.startTime;
      record.error = error instanceof Error ? error.message : 'Unknown error';

      this.logError(error, description, start, showErrorTrace);
      this.saveRecord(record);

      throw error;
    }
  }

  public static message(messageText: string, logType: LogType = 'info', useCurrentIndentLevel: boolean = true): void {
    const symbol = this.getSymbolForLevel(logType);
    this.log(logType, `${useCurrentIndentLevel ? this.getIndent() : ''}${symbol} ${messageText}`);
  }

  public static getRecords(): EventRecord[] {
    return [...this.history];
  }

  public static clearHistory(): void {
    this.history = [];
  }

  private static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, description: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(`${description} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return await Promise.race([promise, timeoutPromise]);
  }

  private static createEventRecord(name: string, startTime: number): EventRecord {
    return {
      name,
      startTime,
      endTime: 0,
      duration: 0,
      succeeded: false,
    };
  }

  private static formatDuration(startTime: number): string {
    return `${(performance.now() - startTime).toFixed(2)}ms`;
  }

  private static getIndent(): string {
    return this.indent.repeat(this.depth);
  }

  private static formatTags(tags: string[]): string {
    return tags.length ? ` [${tags.join(', ')}]` : '';
  }

  private static getSymbolForLevel(logType: LogType): string {
    const map = {
      debug: this.Symbols.debug,
      info: this.Symbols.info,
      warn: this.Symbols.warning,
      error: this.Symbols.failure,
    };

    return map[logType];
  }

  private static log(logType: LogType, message: string): void {
    log[logType](message);
  }

  private static logError(error: unknown, description: string, startTime: number, showTrace: boolean): void {
    const duration = this.formatDuration(startTime);
    const message = error instanceof Error ? error.message : 'Unknown error';

    log.error(`${this.getIndent()}${this.Symbols.failure} ${description} failed (${duration}): ${message}`);

    if (showTrace && error instanceof Error && error.stack) {
      log.error(`${this.getIndent()}  Stack trace:\n${error.stack}`);
    }
  }

  private static saveRecord(record: EventRecord): void {
    this.history.push(record);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
}
