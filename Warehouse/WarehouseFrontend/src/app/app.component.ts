import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WarehouseFrontend';
  public username = 'no name';
  public loginname = 'login?';

  public clickAction() {
    console.log(`going to login ${this.loginname} ${this.username}`);
  }
}
