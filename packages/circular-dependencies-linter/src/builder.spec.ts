import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { cwd } from 'process';
import CircularDependenciesLinterBuilder from './builder';

describe('builder.ts', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  const builderName = 'ng-builders:circular-dependencies-linter';
  const workspaceRoot: string = cwd();

  beforeEach(async () => {
    const registry: schema.CoreSchemaRegistry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost(workspaceRoot, `${workspaceRoot}/e2e/with-circular-dependencies`);
    architect = new Architect(architectHost, registry);
  });

  it('should be registered by @angular/architect correctly', async () => {
    architectHost.addBuilder(builderName, CircularDependenciesLinterBuilder, 'Circular Dependencies Linter');

    const builderIsRegistered: boolean = await architect.has(builderName).toPromise();
    expect(builderIsRegistered).toBeTruthy();
  });
});
