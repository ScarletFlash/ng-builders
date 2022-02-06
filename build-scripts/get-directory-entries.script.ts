import type { Stats } from 'fs';
import { lstat, readdir } from 'fs/promises';
import type { DirectoryEntry } from './directory-entry.interface';

export async function getDirectoryEntries(directoryPath: string): Promise<DirectoryEntry[]> {
  const directoryItems: string[] = await readdir(directoryPath);

  return Promise.all(
    directoryItems.map(async (itemName: string) => {
      const path: string = `${directoryPath}/${itemName}`;
      const stats: Stats = await lstat(path);

      const entry: DirectoryEntry = { path, stats };
      return entry;
    })
  );
}
