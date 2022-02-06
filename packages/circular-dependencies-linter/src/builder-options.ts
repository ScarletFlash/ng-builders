import type { JsonObject } from '@angular-devkit/core';

export interface BuilderOptions extends JsonObject {
  tsConfig: string;
  src: string;
}
