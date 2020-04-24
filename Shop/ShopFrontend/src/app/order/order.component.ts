import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModelService} from '../model/model.service';
import {Product} from '../model/product';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  product: Product;

  constructor(private model: ModelService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.model.currentProduct) {
      this.product = this.model.currentProduct;
    }
  }

  storeOrderAction() {
    // change state of product
    const user = this.model.currentUser;
    this.model.delivery_data(user, this.model.currentProduct, ModelService.DELIVERY_SENT);
    this.model.currentUser = null;
    this.router.navigate(['/delivery']).then(r => console.log('order sent'));
  }
}
