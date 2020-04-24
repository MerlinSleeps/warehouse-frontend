import { Component, OnInit } from '@angular/core';
import {Delivery} from '../model/delivery';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-shipping-center',
  templateUrl: './shipping-center.component.html',
  styleUrls: ['./shipping-center.component.scss']
})
export class ShippingCenterComponent implements OnInit {

  deliveries = [];

  constructor(private model: ModelService) { }

  ngOnInit() {
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
    this.deliveries = [];
    for (const delivery of this.model.deliveryList) {
      if (delivery.state === ModelService.DELIVERY_PICKED) {
        this.deliveries.push(delivery);
      }
    }
  }

  chooseShipAction(delivery: Delivery) {
    this.model.delivery_data(delivery.id, delivery.user, delivery.product, ModelService.DELIVERY_SHIPPED);
    this.ngOnInit();
  }
}
