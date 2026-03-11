import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import type { GeoAIConfig } from 'geo-ai-core';
import {
  ConfigNotFoundError,
  ConfigParseError,
  ConfigValidationError,
} from './errors.js';

export type CliConfig = GeoAIConfig & { outDir: string };

const CONFIG_CANDIDATES = [
  'geo-ai.config.ts',
  'geo-ai.config.js',
  'geo-ai.config.json',
] as const;

export function validateConfig(raw: unknown): CliConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (!obj.siteName || typeof obj.siteName !== 'string' || obj.siteName.trim() === '') return null;
  if (!obj.siteUrl || typeof obj.siteUrl !== 'string' || obj.siteUrl.trim() === '') return null;
  if (!obj.provider) return null;

  return {
    ...(obj as unknown as GeoAIConfig),
    outDir: typeof obj.outDir === 'string' && obj.outDir.trim() !== '' ? obj.outDir : './public',
  };
}

export async function loadConfig(cwd: string, configPath?: string): Promise<CliConfig> {
  if (configPath) {
    return loadFile(configPath, configPath);
  }

  for (const candidate of CONFIG_CANDIDATES) {
    const filePath = join(cwd, candidate);
    try {
      return await loadFile(filePath, filePath);
    } catch (err) {
      if (err instanceof ConfigNotFoundError) continue;
      throw err;
    }
  }

  throw new ConfigNotFoundError(cwd);
}

async function loadFile(filePath: string, label: string): Promise<CliConfig> {
  let raw: unknown;

  if (filePath.endsWith('.json')) {
    let content: string;
    try {
      content = await readFile(filePath, 'utf8');
    } catch (err: unknown) {
      if (isEnoent(err)) throw new ConfigNotFoundError(filePath);
      throw new ConfigParseError(label, 'Could not read file', err);
    }
    try {
      raw = JSON.parse(content);
    } catch (err) {
      throw new ConfigParseError(label, (err as Error).message, err);
    }
  } else {
    // .ts or .js — dynamic import, reads default export
    try {
      const mod = await import(filePath);
      raw = mod.default ?? mod;
    } catch (err: unknown) {
      if (isEnoent(err) || isModuleNotFound(err)) throw new ConfigNotFoundError(filePath);
      throw new ConfigParseError(label, (err as Error).message, err);
    }
  }

  const config = validateConfig(raw);
  if (!config) {
    const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const missing = (['siteName', 'siteUrl', 'provider'] as const).find(
      (f) => !obj[f] || (typeof obj[f] === 'string' && (obj[f] as string).trim() === ''),
    );
    throw new ConfigValidationError(
      missing ?? 'unknown',
      missing ? `Ensure "${missing}" is set in your config file.` : 'Check your config file.',
    );
  }

  return config;
}

function isEnoent(err: unknown): boolean {
  return err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT';
}

function isModuleNotFound(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const code = (err as NodeJS.ErrnoException).code;
  if (code === 'MODULE_NOT_FOUND' || code === 'ERR_MODULE_NOT_FOUND') return true;
  // Vite/Node ESM wraps the error — check one level deep in cause
  if (err.cause instanceof Error) {
    const causeCode = (err.cause as NodeJS.ErrnoException).code;
    if (causeCode === 'MODULE_NOT_FOUND' || causeCode === 'ERR_MODULE_NOT_FOUND') return true;
  }
  return false;
}
