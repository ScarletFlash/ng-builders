import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  public title: string = 'AppModule';

  constructor() {
    const componentInstance: AppComponent = new AppComponent();
    alert(componentInstance.title);
  }
}
