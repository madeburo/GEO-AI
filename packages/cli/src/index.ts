// Error types
export {
  CliError,
  ConfigNotFoundError,
  ConfigParseError,
  ConfigValidationError,
  FsWriteError,
  NetworkError,
  InternalError,
} from './lib/errors.js';

// Logger
export type { Logger, LogLevel } from './lib/logger.js';
export { createLogger, formatMessage } from './lib/logger.js';

// FS adapter
export type { FsAdapter } from './lib/fs.js';
export { nodeFsAdapter } from './lib/fs.js';

// Config
export type { CliConfig } from './lib/config.js';
export { loadConfig, validateConfig } from './lib/config.js';

// Arg parser
export type { ParsedArgs, ParseResult, Command } from './lib/args.js';
export { parseArgs } from './lib/args.js';

// Validate command
export type { ValidationStatus, ValidationResult } from './commands/validate.js';
export { assignStatus } from './commands/validate.js';

// Inspect command
export type { InspectSummary } from './commands/inspect.js';
