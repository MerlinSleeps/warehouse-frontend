import { Component, OnInit } from '@angular/core';
import {ModelService} from '../model/model.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-ramp',
  templateUrl: './ramp.component.html',
  styleUrls: ['./ramp.component.scss']
})
export class RampComponent implements OnInit {

  public palettes = [];
  constructor(private model: ModelService,
              private router: Router) { }

  ngOnInit() {
    this.palettes = this.model.paletteList;
    this.model.warehouseChannel.synchronize();
  }

}
