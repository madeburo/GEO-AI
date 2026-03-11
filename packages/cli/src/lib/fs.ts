import * as fs from 'node:fs/promises';

export interface FsAdapter {
  readFile(path: string): Promise<string | null>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string): Promise<void>;
}

/** Default implementation using node:fs/promises */
export const nodeFsAdapter: FsAdapter = {
  async readFile(path: string): Promise<string | null> {
    try {
      return await fs.readFile(path, 'utf-8');
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  },

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, 'utf-8');
  },

  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  },

  async mkdir(path: string): Promise<void> {
    await fs.mkdir(path, { recursive: true });
  },
};
