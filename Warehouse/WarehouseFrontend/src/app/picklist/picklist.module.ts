import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { PicklistComponent } from './picklist.component';



@NgModule({
  declarations: [PicklistComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class PicklistModule { }
