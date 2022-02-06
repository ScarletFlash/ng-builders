import { build } from 'esbuild';
import { writeFile } from 'fs/promises';
import * as TypeScriptJsonSchema from 'typescript-json-schema';
import type { BuilderSources } from './build-scripts/builder-sources.interface';
import { getBuilderSources } from './build-scripts/get-builder-sources.script';
import { getDirectories } from './build-scripts/get-directories.script';

getDirectories(`${__dirname}/packages`)
  .then((builderSourceDirectories: string[]) => {
    return Promise.all(
      builderSourceDirectories.map(async (sourceDirectory: string) => await getBuilderSources(sourceDirectory))
    );
  })
  .then((builderSources: BuilderSources[]) => {
    builderSources.forEach(async ({ entryPointPath, name, optionsPath }: BuilderSources) => {
      const outDirPath: string = `${__dirname}/dist/${name}`;

      await build({
        chunkNames: 'chunks/[name]-[hash]',
        bundle: true,
        splitting: true,
        external: ['@angular-devkit/architect', '@angular-devkit/core', 'pnpapi', 'rxjs'],
        minify: false,
        platform: 'node',
        sourcemap: 'external',
        target: 'esnext',
        format: 'esm',
        treeShaking: true,
        tsconfig: './tsconfig.json',
        mainFields: ['module', 'main', 'browser'],
        color: true,
        metafile: true,
        legalComments: 'linked',
        outdir: outDirPath,
        entryPoints: [entryPointPath],
      });

      const program: TypeScriptJsonSchema.Program = TypeScriptJsonSchema.getProgramFromFiles([optionsPath]);
      const schemaDefinition: TypeScriptJsonSchema.Definition | null = TypeScriptJsonSchema.generateSchema(
        program,
        'BuilderOptions'
      );

      if (schemaDefinition === null) {
        throw new Error(`Builder schema creation for "${name}" failed.`);
      }

      await writeFile(`${outDirPath}/schema.json`, JSON.stringify(schemaDefinition));
    });
  });
