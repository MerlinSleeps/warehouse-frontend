import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DeliveryComponent} from './delivery/delivery.component';
import {LoginComponent} from './login/login.component';
import {OrderComponent} from './order/order.component';
import {ShopComponent} from './shop/shop.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'delivery',
    component: DeliveryComponent

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
