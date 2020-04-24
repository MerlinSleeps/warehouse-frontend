import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ShopComponent } from './shop.component';



@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ShopModule { }
