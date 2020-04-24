import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  public palette;
  public placeIn;

  constructor(
    private model: ModelService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.palette = this.model.currentPalette;
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
  }

  storePaletteAction() {
    this.model.paletteData(
      this.palette.id,
      this.palette.product,
      this.palette.items,
      this.placeIn,
      this.palette.priority,
      this.model.currentUser,
      this.model.getDate(),
      ModelService.STORED_IN_FRONTEND);
    this.model.loadsEvent();
    this.router.navigate(['/ramp']).then(r => console.log('go to ramp'));
  }
}
