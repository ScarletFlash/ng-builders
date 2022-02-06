export class CircularDependency {
  private readonly filePaths: string[];

  constructor(filePaths: string[]) {
    this.filePaths = filePaths.concat().sort();
  }

  public toString(): string {
    if (this.filePaths.length === 0) {
      return '';
    }

    return this.filePaths.join('⭬');
  }

  public toReportItem(): string {
    const lineBreak: string = '\n';
    const dependencyReportItem: string = this.filePaths.reduce(
      (accumulatedMessage: string, currentPath: string, index: number, source: string[]) => {
        const isFirstItem: boolean = index === 0;
        if (isFirstItem) {
          return `⭡⮧ ${currentPath}`;
        }

        const isLastItem: boolean = index === source.length - 1;
        if (isLastItem) {
          return accumulatedMessage + lineBreak + `⮤⭣ ${currentPath}`;
        }

        return accumulatedMessage + lineBreak + `⭡⭣ ${currentPath}`;
      },
      ''
    );

    return dependencyReportItem;
  }
}
