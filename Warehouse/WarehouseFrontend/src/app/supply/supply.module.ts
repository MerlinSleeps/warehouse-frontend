import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplyComponent } from './supply.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [SupplyComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class SupplyModule { }
