import type { Stats } from 'fs';

export interface DirectoryEntry {
  path: string;
  stats: Stats;
}
