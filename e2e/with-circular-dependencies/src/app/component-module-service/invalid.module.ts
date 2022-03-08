import { NgModule } from '@angular/core';
import { InvalidComponent } from './invalid.component';

@NgModule({
  declarations: [InvalidComponent],
  bootstrap: [InvalidComponent],
})
export class InvalidModule {
  public readonly title: string = this.constructor.name;

  constructor() {
    const componentInstance: InvalidComponent = new InvalidComponent();
    alert(componentInstance.title);
  }
}
