export type Command = 'init' | 'generate' | 'validate' | 'inspect';

export interface ParsedArgs {
  command: Command | null;
  config?: string;   // --config <path>
  out?: string;      // --out <path>
  url?: string;      // --url <url>
  path?: string;     // --path <path>
  help: boolean;     // --help | -h
  version: boolean;  // --version | -v
}

export type ParseResult =
  | { ok: true; args: ParsedArgs }
  | { ok: false; error: string; exitCode: 1 };

const VALID_COMMANDS = new Set<Command>(['init', 'generate', 'validate', 'inspect']);

const VALUE_FLAGS = new Set(['--config', '--out', '--url', '--path']);

/** Pure function — no side effects, no process.exit */
export function parseArgs(argv: string[]): ParseResult {
  const result: ParsedArgs = {
    command: null,
    help: false,
    version: false,
  };

  let i = 0;
  while (i < argv.length) {
    const token = argv[i];

    if (token === '--help' || token === '-h') {
      result.help = true;
      i++;
    } else if (token === '--version' || token === '-v') {
      result.version = true;
      i++;
    } else if (VALUE_FLAGS.has(token)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: `Flag ${token} requires a value`, exitCode: 1 };
      }
      const key = token.slice(2) as 'config' | 'out' | 'url' | 'path';
      result[key] = value;
      i += 2;
    } else if (token.startsWith('--') || (token.startsWith('-') && token.length === 2 && token !== '-h' && token !== '-v')) {
      return { ok: false, error: `Unknown flag: ${token}`, exitCode: 1 };
    } else if (token.startsWith('-') && token.length > 1) {
      return { ok: false, error: `Unknown flag: ${token}`, exitCode: 1 };
    } else {
      // Positional token — treat as command
      if (result.command === null) {
        if (!VALID_COMMANDS.has(token as Command)) {
          return { ok: false, error: `Unknown command: "${token}". Valid commands: init, generate, validate, inspect`, exitCode: 1 };
        }
        result.command = token as Command;
      }
      i++;
    }
  }

  return { ok: true, args: result };
}
