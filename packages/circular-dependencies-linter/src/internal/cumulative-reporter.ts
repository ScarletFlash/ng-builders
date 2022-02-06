import type { BuilderContext } from '@angular-devkit/architect';

type StatusReporter = BuilderContext['reportStatus'];

export class CumulativeReporter {
  private accumulatedData: string = '';

  constructor(private readonly reportStatus: StatusReporter) {}

  public next(message: string): void {
    this.accumulatedData = this.accumulatedData + '\n' + message;
    this.reportStatus(this.accumulatedData);
  }

  public clear(): void {
    this.accumulatedData = '';
  }
}
