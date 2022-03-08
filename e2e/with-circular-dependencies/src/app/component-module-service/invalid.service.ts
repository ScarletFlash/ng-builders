import { Injectable } from '@angular/core';
import { InvalidModule } from './invalid.module';

@Injectable()
export class InvalidService {
  public readonly title: string = this.constructor.name;

  constructor() {
    const moduleInstance: InvalidModule = new InvalidModule();
    alert(moduleInstance.title);
  }
}
