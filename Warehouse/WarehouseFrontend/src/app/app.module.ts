import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {LoginModule} from './login/login.module';
import {SupplyModule} from './supply/supply.module';
import {ModelService} from './model/model.service';
import {RampModule} from './ramp/ramp.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    SupplyModule,
    RampModule,
    HttpClientModule
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
