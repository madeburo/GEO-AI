# geo-ai-cli

[![npm](https://img.shields.io/npm/v/geo-ai-cli)](https://npmjs.com/package/geo-ai-cli)

Part of the [GEO AI – AI Search Optimization](https://www.geoai.run) ecosystem. [GitHub](https://github.com/madeburo/GEO-AI)

CLI for generating and validating `llms.txt` / `llms-full.txt` — the standard format for exposing your site's content to AI search engines (ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Grok and more).

Works with any Node.js project. Powered by [`geo-ai-core`](https://npmjs.com/package/geo-ai-core).

## Installation

```bash
# Local (recommended)
npm install --save-dev geo-ai-cli

# Global
npm install -g geo-ai-cli
```

## Quick Start

```bash
# 1. Scaffold a config file
npx geo-ai init

# 2. Edit geo-ai.config.ts with your site details

# 3. Generate llms.txt and llms-full.txt into ./public
npx geo-ai generate

# 4. Validate the output
npx geo-ai validate
```

## Commands

### `geo-ai init`

Scaffolds a `geo-ai.config.ts` starter file in the current directory. Exits without overwriting if a config already exists.

```bash
geo-ai init
```

### `geo-ai generate`

Generates `llms.txt` and `llms-full.txt` from your config and writes them to the output directory.

```bash
geo-ai generate [--config <path>] [--out <path>]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--config` | auto-discover | Path to config file |
| `--out` | `./public` | Output directory |

Config discovery order: `geo-ai.config.ts` → `geo-ai.config.js` → `geo-ai.config.json`

### `geo-ai validate`

Checks that `llms.txt` and `llms-full.txt` are present and have valid content. Supports both local files and remote URLs.

```bash
geo-ai validate [--path <dir>] [--url <url>]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--path` | `./public` | Local directory to check |
| `--url` | — | Remote base URL (fetches `<url>/llms.txt` and `<url>/llms-full.txt`) |

Exit codes: `0` — all pass/warn, `1` — any fail or not found.

### `geo-ai inspect`

Previews your config: site info, crawler rules, resource sections with item counts. Optionally fetches and displays remote llms files.

```bash
geo-ai inspect [--config <path>] [--url <url>]
```

## Config File

```typescript
// geo-ai.config.ts
import type { GeoAIConfig } from 'geo-ai-core';

export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  siteDescription: 'A brief description for AI crawlers.',
  crawlers: 'all',
  provider: {
    Pages: [
      { title: 'Home', url: 'https://example.com/', description: 'Welcome page' },
    ],
    Blog: [
      { title: 'Getting Started', url: 'https://example.com/blog/start', description: 'First steps' },
    ],
  },
} satisfies GeoAIConfig;
```

Required fields: `siteName`, `siteUrl`, `provider`.

## Debug Mode

Set `DEBUG=geo-ai` to print stack traces to stderr:

```bash
DEBUG=geo-ai geo-ai generate
```

## Requirements

- Node.js >= 20

## License

[GPL v2](../../LICENSE)
