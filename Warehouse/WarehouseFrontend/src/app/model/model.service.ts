import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public date: string;
  public userName: string;
  constructor() {
    this.date = new Date().toISOString();
  }
}
