import { resolve } from 'path';
import type { BuilderSources } from './builder-sources.interface';
import type { DirectoryEntry } from './directory-entry.interface';
import { getDirectoryEntries } from './get-directory-entries.script';

export async function getBuilderSources(builderDirectory: string): Promise<BuilderSources> {
  const directoryEntries: DirectoryEntry[] = await getDirectoryEntries(`${builderDirectory}/src`);

  const name: string = builderDirectory.substring(builderDirectory.lastIndexOf('/') + 1);

  const sources: Partial<BuilderSources> = await directoryEntries.reduce(
    async (accumulatedData: Promise<Partial<BuilderSources>>, { stats, path }: DirectoryEntry) => {
      const data: Partial<BuilderSources> = await accumulatedData;

      if (stats.isDirectory()) {
        return data;
      }

      if (path.endsWith('/builder.ts')) {
        return { ...data, entryPointPath: resolve(path) };
      }

      if (path.endsWith('/builder-options.ts')) {
        return { ...data, optionsPath: resolve(path) };
      }

      return data;
    },
    Promise.resolve({
      name,
    })
  );

  if (isSourcesObject(sources)) {
    return sources;
  }

  throw new Error(`Sources for directory "${builderDirectory}" not found. Invalid sources: ${JSON.stringify(sources)}`);
}

function isSourcesObject(input: object): input is BuilderSources {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  const requiredObjectKeys: Set<keyof BuilderSources> = new Set<keyof BuilderSources>([
    'entryPointPath',
    'optionsPath',
    'name',
  ]);
  return Array.from(requiredObjectKeys).every((requiredKey: string) => requiredKey in input);
}
