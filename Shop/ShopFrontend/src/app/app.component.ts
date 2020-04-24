import {Component, OnInit} from '@angular/core';
import {ModelService} from './model/model.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public title = 'ShopFrontend';

  constructor(
    private model: ModelService,
  ) {}

  ngOnInit() {
    this.model.loadsEvent();
    this.model.initChannels();
  }
}
