import { Component, OnInit } from '@angular/core';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';

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
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.model.currentUser) {
      console.log('no current user exist')
      return;
    }
    console.log('current user exist')
    this.employeeIdIn = this.model.currentUser.id;
    this.nameIn = this.model.currentUser.name;
  }

  loginAction() {
    const date = new Date().toISOString();
    const user = this.model.user_data(this.employeeIdIn, this.nameIn, date);
    this.model.currentUser_data(user);
    console.log(`storing ${this.model.currentUser.name}`);
    this.router.navigate(['/supply']).then(r => console.log('login user'));
  }
}
