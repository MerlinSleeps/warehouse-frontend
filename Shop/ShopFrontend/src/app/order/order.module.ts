import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { OrderComponent } from './order.component';



@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class OrderModule { }
