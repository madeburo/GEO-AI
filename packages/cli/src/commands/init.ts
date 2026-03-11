import * as path from 'node:path';
import type { FsAdapter } from '../lib/fs.js';
import type { Logger } from '../lib/logger.js';
import { FsWriteError } from '../lib/errors.js';

const CONFIG_FILENAME = 'geo-ai.config.ts';

const CONFIG_TEMPLATE = `import type { GeoAIConfig } from 'geo-ai-core';

export default {
  siteName: "My Site",
  siteUrl: "https://example.com",
  siteDescription: "A brief description of my site for AI crawlers.",
  crawlers: "all",
  provider: {
    Pages: [
      {
        title: "Home",
        url: "https://example.com/",
        description: "Welcome to My Site",
      },
    ],
  },
} satisfies GeoAIConfig;
`;

export async function runInit(
  cwd: string,
  fs: FsAdapter,
  logger: Logger,
): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILENAME);

  if (await fs.exists(configPath)) {
    logger.warn(`Config file already exists: ${configPath}`);
    return;
  }

  try {
    await fs.writeFile(configPath, CONFIG_TEMPLATE);
  } catch (err) {
    throw new FsWriteError(configPath, err);
  }

  logger.success(`Created ${configPath}`);
  logger.nextSteps([
    `Edit ${CONFIG_FILENAME} with your site details`,
    'Run `geo-ai generate` to produce llms.txt and llms-full.txt',
    'Run `geo-ai validate` to check your output files',
    'Run `geo-ai inspect` to preview your configuration',
  ]);
}
