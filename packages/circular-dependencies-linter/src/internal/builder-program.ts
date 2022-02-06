import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { JsonObject } from '@angular-devkit/core';
import type { BuilderOptions } from '../builder-options';
import type { CircularDependency } from './circular-dependency';
import { DependencyGraph } from './dependency-graph';

export async function builderProgram(
  { tsConfig }: BuilderOptions,
  { workspaceRoot, target, logger, getProjectMetadata }: BuilderContext
): Promise<BuilderOutput> {
  if (target === undefined) {
    logger.error('Target should be defined for dependencies validation.');
    return {
      success: false,
      error: 'Invalid configuration error.',
    };
  }

  const projectMetadata: JsonObject = await getProjectMetadata(target);
  const projectRoot: string = getSourceRoot(projectMetadata);

  const graph: DependencyGraph = new DependencyGraph(`${workspaceRoot}/${projectRoot}`, {
    fileExtensions: ['js', 'ts'],
    tsConfig: `${workspaceRoot}/${tsConfig}`,
  });

  const circularDependencies: CircularDependency[] = await graph.getCircularDependencies();

  if (circularDependencies.length === 0) {
    logger.info('No circular dependencies found.');

    return {
      success: true,
    };
  }

  logger.fatal(`Found circular dependencies: ${circularDependencies.length}`);
  circularDependencies.forEach((circularDependency: CircularDependency, index: number) => {
    const reportItem: string = circularDependency.toReportItem();
    const item: string = '\n' + `● ${index + 1}:` + '\n' + reportItem;
    logger.fatal(item);
  });

  return {
    success: false,
  };
}

function getSourceRoot(projectMetadata: JsonObject): string {
  if (!hasSourceRoot(projectMetadata)) {
    throw new Error('Source root not found.');
  }

  return projectMetadata.sourceRoot;
}

function hasSourceRoot(projectMetadata: JsonObject): projectMetadata is JsonObject & { sourceRoot: string } {
  const sourceRootKey: string = 'sourceRoot';
  return sourceRootKey in projectMetadata && typeof projectMetadata[sourceRootKey] === 'string';
}
