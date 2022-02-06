import type { MadgeConfig, MadgeInstance, MadgePath } from 'madge';
import madge from 'madge';
import { CircularDependency } from './circular-dependency';

export class DependencyGraph {
  private readonly madgeInstance: Promise<MadgeInstance>;

  constructor(path: MadgePath, config: MadgeConfig) {
    this.madgeInstance = madge(path, config);
  }

  public async getCircularDependencies(): Promise<CircularDependency[]> {
    const madgeInstance: MadgeInstance = await this.madgeInstance;
    const foundDependencies: CircularDependency[] = madgeInstance
      .circular()
      .map((filePaths: string[]) => new CircularDependency(filePaths));

    if (foundDependencies.length === 0) {
      return [];
    }

    const uniqueDependencies: Map<string, CircularDependency> = new Map<string, CircularDependency>(
      foundDependencies.map((dependency: CircularDependency) => [dependency.toString(), dependency])
    );

    return Array.from(uniqueDependencies.values());
  }
}
