import type { PackageJson } from '@npm/types';
import { build } from 'esbuild';
import { copyFile, mkdir, readFile, rm, writeFile } from 'fs/promises';
import * as TypeScriptJsonSchema from 'typescript-json-schema';
import type { BuilderSources } from './build-scripts/builder-sources.interface';
import { getBuilderSources } from './build-scripts/get-builder-sources.script';
import { getDirectories } from './build-scripts/get-directories.script';

type PackageJsonKey = keyof PackageJson | string;

const descriptionByBuilderName: Map<string, string> = new Map<string, string>([
  ['circular-dependencies-linter', 'Linter for circular dependencies'],
]);

const distPath: string = `${__dirname}/dist`;
rm(distPath, { force: true, recursive: true })
  .then(() => mkdir(distPath))
  .then(() => getDirectories(`${__dirname}/packages`))
  .then((builderSourceDirectories: string[]) =>
    Promise.all(
      builderSourceDirectories.map(async (sourceDirectory: string) => await getBuilderSources(sourceDirectory))
    )
  )
  .then(async (builderSources: BuilderSources[]) => {
    builderSources.forEach(async (sources: BuilderSources) => {
      const { entryPointPath, name }: BuilderSources = sources;
      const outDirPath: string = `${__dirname}/dist/${name}`;

      await build({
        chunkNames: 'chunks/[name]-[hash]',
        bundle: true,
        splitting: false,
        external: ['@angular-devkit/architect', '@angular-devkit/core', 'pnpapi', 'rxjs'],
        minify: true,
        platform: 'node',
        sourcemap: 'external',
        target: 'node16',
        format: 'cjs',
        treeShaking: true,
        tsconfig: './tsconfig.builders.json',
        mainFields: ['module', 'main', 'browser'],
        color: true,
        metafile: true,
        legalComments: 'linked',
        outdir: outDirPath,
        entryPoints: [entryPointPath],
      });

      await generateBuilderSchema(sources, outDirPath);
    });

    await generateBuildersJson(builderSources);

    await generatePackageJson();
  });

async function generateBuilderSchema({ name, optionsPath }: BuilderSources, outDirPath: string): Promise<void> {
  const program: TypeScriptJsonSchema.Program = TypeScriptJsonSchema.getProgramFromFiles([optionsPath]);
  const builderSchema: TypeScriptJsonSchema.Definition | null = TypeScriptJsonSchema.generateSchema(
    program,
    'BuilderOptions'
  );

  if (builderSchema === null) {
    throw new Error(`Builder schema creation for "${name}" failed.`);
  }

  await writeFile(`${outDirPath}/schema.json`, JSON.stringify(builderSchema));
}

async function generateBuildersJson(builderSources: BuilderSources[]): Promise<void> {
  const buildersJsonContent: object = builderSources.reduce((accumulatedData: object, { name }: BuilderSources) => {
    return {
      ...accumulatedData,
      [name]: {
        description: descriptionByBuilderName.get(name),
        schema: `./${name}/schema.json`,
        implementation: `./${name}/builder.js`,
      },
    };
  }, {});

  await writeFile(`${__dirname}/dist/builders.json`, JSON.stringify({ builders: buildersJsonContent }));
}

async function generatePackageJson(): Promise<void> {
  const rootPackageJsonData: Record<PackageJsonKey, unknown> = await readFile(
    `${__dirname}/package.json`,
    'utf-8'
  ).then((fileData: string) => JSON.parse(fileData));
  const allowedFields: Set<PackageJsonKey> = new Set<PackageJsonKey>([
    'dependencies',
    'name',
    'version',
    'license',
    'author',
    'bugs',
    'description',
    'homepage',
    'keywords',
    'repository',
    'icon',
  ]);

  const sanitizedPackageJsonEntries = Object.entries(rootPackageJsonData).filter(([key, value]: [string, unknown]) => {
    const stringifiedValue: string = JSON.stringify(value);
    const valueIsEmpty: boolean = stringifiedValue === '' || stringifiedValue === '[]' || stringifiedValue === '{}';
    return allowedFields.has(key) && !valueIsEmpty;
  });

  const resultPackageJsonContent: Record<PackageJsonKey, unknown> = Object.fromEntries([
    ...sanitizedPackageJsonEntries,
    ['builders', './builders.json'],
  ]);
  await writeFile(`${__dirname}/dist/package.json`, JSON.stringify(resultPackageJsonContent));

  await mkdir(`${__dirname}/dist/assets`);
  await copyFile(`${__dirname}/assets/icon.png`, `${__dirname}/dist/assets/icon.png`);
}
