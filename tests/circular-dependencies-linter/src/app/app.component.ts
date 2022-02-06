import { Component } from '@angular/core';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  template: ``,
  styles: [],
})
export class AppComponent {
  public title: string = 'circular-dependencies-linter';

  constructor() {
    const moduleInstance: AppModule = new AppModule();
    alert(moduleInstance.title);
  }
}
