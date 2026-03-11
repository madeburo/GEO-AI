export class CliError extends Error {
  constructor(
    message: string,
    public readonly exitCode: 0 | 1 | 2 = 1,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConfigNotFoundError extends CliError {
  constructor(cwd: string) {
    super(`No config file found in ${cwd}. Run \`geo-ai init\` to create one.`, 1);
  }
}

export class ConfigParseError extends CliError {
  constructor(filePath: string, detail: string, cause?: unknown) {
    super(`Failed to parse ${filePath}: ${detail}`, 1, cause);
  }
}

export class ConfigValidationError extends CliError {
  constructor(field: string, detail: string) {
    super(`Config is missing required field: ${field}. ${detail}`, 1);
  }
}

export class FsWriteError extends CliError {
  constructor(filePath: string, cause?: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Could not write ${filePath}: ${reason}`, 1, cause);
  }
}

export class NetworkError extends CliError {
  constructor(url: string, cause?: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Network error fetching ${url}: ${reason}`, 1, cause);
  }
}

export class InternalError extends CliError {
  constructor(message = 'Unexpected error. Set DEBUG=geo-ai for details.', cause?: unknown) {
    super(message, 2, cause);
  }
}
