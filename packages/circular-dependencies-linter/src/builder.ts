import { createBuilder } from '@angular-devkit/architect';
import type { Builder } from '@angular-devkit/architect/src/internal';
import type { BuilderOptions } from './builder-options';
import { builderProgram } from './internal/builder-program';

const builder: Builder<BuilderOptions> = createBuilder(builderProgram);
export default builder;
