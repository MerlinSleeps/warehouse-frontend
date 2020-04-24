import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {LoginModule} from './login/login.module';
import {PicklistModule} from './picklist/picklist.module';
import {ShippingCenterModule} from './shipping-center/shipping-center.module';
import {StoreModule} from './store/store.module';
import {SupplyModule} from './supply/supply.module';
import {ModelService} from './model/model.service';
import {RampModule} from './ramp/ramp.module';
import {HttpClientModule} from '@angular/common/http';
import { ShippingCenterComponent } from './shipping-center/shipping-center.component';

@NgModule({
  declarations: [
    AppComponent,
    ShippingCenterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    StoreModule,
    SupplyModule,
    RampModule,
    PicklistModule,
    ShippingCenterModule,
    HttpClientModule,
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
