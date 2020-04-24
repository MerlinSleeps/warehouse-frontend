import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DeliveryModule} from './delivery/delivery.module';
import {LoginModule} from './login/login.module';
import {ModelService} from './model/model.service';
import {OrderModule} from './order/order.module';
import {ShopModule} from './shop/shop.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    ShopModule,
    OrderModule,
    DeliveryModule,
    HttpClientModule,
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
