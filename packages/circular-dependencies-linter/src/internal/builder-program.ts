import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { BuilderOptions } from '../builder-options';
import type { CircularDependency } from './circular-dependency';
import { DependencyGraph } from './dependency-graph';

export async function builderProgram(
  { tsConfig, src }: BuilderOptions,
  { workspaceRoot, target, logger }: BuilderContext
): Promise<BuilderOutput> {
  if (target === undefined) {
    logger.error('Target should be defined for dependencies validation.');
    return {
      success: false,
      error: 'Invalid configuration error.',
    };
  }

  const graph: DependencyGraph = new DependencyGraph(`${workspaceRoot}/${src}`, {
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
