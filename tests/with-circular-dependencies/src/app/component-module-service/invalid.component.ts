import { Component } from '@angular/core';
import { InvalidService } from './invalid.service';

@Component({
  selector: 'app-invalid',
})
export class InvalidComponent {
  public readonly title: string = this.constructor.name;

  constructor() {
    const serviceInstance: InvalidService = new InvalidService();
    alert(serviceInstance.title);
  }
}
