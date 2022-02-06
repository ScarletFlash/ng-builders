import type { DirectoryEntry } from './directory-entry.interface';
import { getDirectoryEntries } from './get-directory-entries.script';

export async function getDirectories(directoryPath: string): Promise<string[]> {
  const directoryEntries: DirectoryEntry[] = await getDirectoryEntries(directoryPath);

  return directoryEntries
    .filter(({ stats }: DirectoryEntry) => stats.isDirectory())
    .map(({ path }: DirectoryEntry) => path);
}
