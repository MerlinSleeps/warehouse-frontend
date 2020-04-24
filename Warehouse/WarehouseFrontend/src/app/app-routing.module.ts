import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PicklistComponent} from './picklist/picklist.component';
import {ShippingCenterComponent} from './shipping-center/shipping-center.component';
import {StoreComponent} from './store/store.component';
import {SupplyComponent} from './supply/supply.component';
import {RampComponent} from './ramp/ramp.component';


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
    path: 'supply',
    component: SupplyComponent
  },
  {
    path: 'ramp',
    component: RampComponent
  },
  {
    path: 'store',
    component: StoreComponent
  },
  {
    path: 'picklist',
    component: PicklistComponent,
  },
  {
    path: 'shippingCenter',
    component: ShippingCenterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
