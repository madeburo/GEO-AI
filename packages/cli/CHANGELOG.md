# Changelog

All notable changes to `geo-ai-cli` will be documented in this file.

## [0.1.0] - 2026-03-11

### Added

- `geo-ai init` — scaffolds a `geo-ai.config.ts` starter file; exits safely if config already exists
- `geo-ai generate` — generates `llms.txt` and `llms-full.txt` from config into `./public` (or `--out`)
- `geo-ai validate` — checks local files or remote URLs for presence and valid content; exits `1` on fail/not_found
- `geo-ai inspect` — previews config (site info, crawler rules, resource sections) or fetches remote llms files via `--url`
- `--config`, `--out`, `--url`, `--path` value flags; `--help`/`-h`, `--version`/`-v` boolean flags
- Config discovery: `geo-ai.config.ts` → `geo-ai.config.js` → `geo-ai.config.json`
- Typed error classes with exit codes: `ConfigNotFoundError`, `ConfigParseError`, `ConfigValidationError`, `FsWriteError`, `NetworkError` (exit `1`), `InternalError` (exit `2`)
- `DEBUG=geo-ai` env var for stack trace output to stderr
- Zero runtime dependencies beyond `geo-ai-core`
- ESM-only build via tsup with `#!/usr/bin/env node` shebang
