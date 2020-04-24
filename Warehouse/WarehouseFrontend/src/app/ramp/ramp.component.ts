import { Component, OnInit } from '@angular/core';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';
import {Palette} from '../model/palette';

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
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
    this.palettes = this.model.paletteList;
  }

  choosePaletteAction(palette: Palette) {
    this.model.currentPalette = palette;
    this.router.navigate(['/store']);
  }
}
