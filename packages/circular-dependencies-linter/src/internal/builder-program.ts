import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { BuilderOptions } from '../builder-options';
import type { CircularDependency } from './circular-dependency';
import { CumulativeReporter } from './cumulative-reporter';
import { DependencyGraph } from './dependency-graph';

export async function builderProgram(
  { tsConfig, src }: BuilderOptions,
  { workspaceRoot, target, logger, reportStatus, reportProgress }: BuilderContext
): Promise<BuilderOutput> {
  reportProgress(0, 2, 'Checking configuration.');

  if (target === undefined) {
    logger.error('Target should be defined for dependencies validation.');
    return {
      success: false,
      error: 'Invalid configuration error.',
    };
  }

  reportProgress(1, 2, 'Building dependency graph.');

  const graph: DependencyGraph = new DependencyGraph(`${workspaceRoot}/${src}`, {
    fileExtensions: ['js', 'ts'],
    tsConfig: `${workspaceRoot}/${tsConfig}`,
  });

  const circularDependencies: CircularDependency[] = await graph.getCircularDependencies();

  reportProgress(2, 2, 'Preparing report.');

  if (circularDependencies.length === 0) {
    reportStatus('No circular dependencies found.');
    return {
      success: true,
    };
  }

  reportStatus('');
  const cumulativeReporter: CumulativeReporter = new CumulativeReporter(reportStatus);

  cumulativeReporter.next(`Found ${circularDependencies.length} circular dependencies:`);
  circularDependencies.forEach((circularDependency: CircularDependency, index: number) => {
    const reportItem: string = circularDependency.toReportItem();
    cumulativeReporter.next('\n' + `● ${index}:` + '\n' + reportItem);
  });

  return {
    success: false,
  };
}
