export type LogLevel = 'success' | 'warn' | 'error' | 'info';

const PREFIX: Record<LogLevel, string> = {
  success: '✓',
  warn: '⚠',
  error: '✗',
  info: '·',
};

/** Pure function — returns prefixed string without any side effects */
export function formatMessage(level: LogLevel, msg: string): string {
  return `${PREFIX[level]} ${msg}`;
}

export interface Logger {
  success(msg: string): void;
  warn(msg: string): void;
  error(msg: string, err?: unknown): void;
  info(msg: string): void;
  nextSteps(steps: string[]): void;
}

/** Creates a logger. Writes success/info to stdout, warn/error to stderr.
 *  When debug=true (or DEBUG=geo-ai), also writes stack traces to stderr. */
export function createLogger(debug?: boolean): Logger {
  const isDebug = debug ?? process.env['DEBUG'] === 'geo-ai';

  return {
    success(msg) {
      process.stdout.write(formatMessage('success', msg) + '\n');
    },
    warn(msg) {
      process.stderr.write(formatMessage('warn', msg) + '\n');
    },
    error(msg, err?) {
      process.stderr.write(formatMessage('error', msg) + '\n');
      if (isDebug && err instanceof Error && err.stack) {
        process.stderr.write(err.stack + '\n');
      }
    },
    info(msg) {
      process.stdout.write(formatMessage('info', msg) + '\n');
    },
    nextSteps(steps) {
      process.stdout.write('\nNext steps:\n');
      for (const step of steps) {
        process.stdout.write(`  ${PREFIX['info']} ${step}\n`);
      }
    },
  };
}
