import { Component, OnInit } from '@angular/core';
import {ModelService} from "../model/model.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  employeeIdIn: string;
  nameIn: string;

  constructor(
    private model: ModelService,
  ) {}

  ngOnInit() {
    const user = this.model.userName;
  }

  loginAction() {
    this.model.userName = this.employeeIdIn;
    console.log(`storing ${this.model.userName}`);
  }
}
