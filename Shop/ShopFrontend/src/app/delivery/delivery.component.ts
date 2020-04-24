import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  deliveries = [];

  constructor(private model: ModelService) { }

  ngOnInit(): void {
    this.deliveries = this.model.deliveryList;
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
  }

}
