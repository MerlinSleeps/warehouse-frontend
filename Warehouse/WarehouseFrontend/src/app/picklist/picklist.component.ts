import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Delivery} from '../model/delivery';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent implements OnInit {

  public deliveries = [];

  constructor(private model: ModelService,
              private router: Router) { }

  ngOnInit() {
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
    for (const delivery of this.model.deliveryList) {
      if (delivery.state === ModelService.DELIVERY_RECEIVED) {
              this.deliveries.push(delivery);
      }
    }
  }

  choosePickAction(delivery: Delivery) {
    this.model.delivery_data(delivery.id, delivery.user, delivery.product, ModelService.DELIVERY_PICKED);
    this.router.navigate(['/shippingCenter']).then((r) => console.log('delivery picked'));
  }
}
