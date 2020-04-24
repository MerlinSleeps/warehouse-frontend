import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { StoreComponent } from './store.component';



@NgModule({
  declarations: [StoreComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class StoreModule { }
