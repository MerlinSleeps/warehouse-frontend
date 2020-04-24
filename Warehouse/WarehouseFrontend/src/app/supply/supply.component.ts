import { Component, OnInit } from '@angular/core';
import user from '../../../../WarehouseBackend/src/model/user';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.scss']
})
export class SupplyComponent implements OnInit {
  palId: string;
  productName: string;
  items: number;
  prio: string;

  constructor(
    private model: ModelService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.model.currentPalette) {
      return;
    }
    this.palId = this.model.currentPalette.id;
    this.items = this.model.currentPalette.items;
    this.prio = this.model.currentPalette.priority;
    this.productName = this.model.currentPalette.product;
  }

  supplyAction() {
    this.model.paletteData(
      this.palId,
      this.productName,
      this.items,
      undefined,
      this.prio,
      this.model.currentUser,
      this.model.getDate(),
      ModelService.ADDED_IN_FRONTEND);
    this.router.navigate(['/ramp']).then(r => console.log('go to ramp'));

  }
}
