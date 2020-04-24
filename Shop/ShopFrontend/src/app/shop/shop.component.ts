import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModelService} from '../model/model.service';
import {Product} from '../model/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  public products = [];

  constructor(private model: ModelService,
              private router: Router) { }

  ngOnInit(): void {
    this.products = this.model.productList;
    this.model.loadsEvent();
    this.model.warehouseChannel.synchronize();
  }

  chooseProductAction(product: Product) {
    this.model.currentProduct = product;
    console.log(this.model.currentProduct);
    this.router.navigate(['/order']).then(r => console.log('Please confirm order'));
  }
}
