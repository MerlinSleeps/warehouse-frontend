import {Component, OnInit} from '@angular/core';
import {ModelService} from './model/model.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WarehouseFrontend';
  public username = 'no name';
  public loginname = 'login?';

  constructor(
    private model: ModelService,
  ) {}

  ngOnInit() {
    this.model.loadsEvent();
    this.model.initChannels();
  }
}
