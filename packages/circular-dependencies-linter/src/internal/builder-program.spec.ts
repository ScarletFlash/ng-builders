import type { BuilderContext, BuilderOutput, Target } from '@angular-devkit/architect';
import type { JsonObject } from '@angular-devkit/core';
import type { BuilderOptions } from '../builder-options';
import { builderProgram } from './builder-program';

describe('builder-program.ts', () => {
  const builderName = 'ng-builders:circular-dependencies-linter';

  let builderOptions: BuilderOptions;
  let builderContext: BuilderContext;

  beforeEach(async () => {
    builderOptions = {
      tsConfig: 'fake-path.json',
    };

    builderContext = {
      id: Math.floor(Math.random() * 100),
      builder: {
        builderName,
        description: '',
        optionSchema: false,
      },
      logger: {
        error: (_message: string, _metadata?: JsonObject): void => {
          return;
        },
      } as any,
      workspaceRoot: '',
      currentDirectory: '',
      getTargetOptions: (_target: Target): Promise<JsonObject> => {
        return Promise.resolve({
          key: 'value',
        });
      },
      getProjectMetadata: (_projectNameOrTarget: string | Target): Promise<JsonObject> => {
        return Promise.resolve({
          key: 'value',
        });
      },
      getBuilderNameForTarget: (_target: Target): Promise<string> => {
        return Promise.resolve('');
      },
      reportRunning: (): void => {
        return;
      },
      reportStatus: (_status: string): void => {
        return;
      },
      reportProgress: (_current: number, _total?: number, _status?: string): void => {
        return;
      },
      analytics: undefined as any,
    } as any;
  });

  it('should throw an error if something went wrong in configuration', async () => {
    const brokenBuilderOptions: Record<keyof BuilderOptions, unknown> = {
      prettierConfig: 1234,
    };
    const brokenBuilderContext: Partial<Record<keyof BuilderContext, unknown>> = {
      target: undefined,
    };

    try {
      await builderProgram(brokenBuilderOptions as any, brokenBuilderContext as any);
    } catch (response) {
      expect(response).toBeInstanceOf(Error);
    }
  });

  it('should fail if target is unreachable', async () => {
    const { success }: BuilderOutput = await builderProgram(builderOptions, { ...builderContext, target: undefined });
    expect(success).toBeFalsy();
  });
});
