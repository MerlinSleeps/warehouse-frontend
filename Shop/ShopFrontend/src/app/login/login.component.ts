import {ModelService} from '../model/model.service';
import { Component, OnInit } from '@angular/core';
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
    public model: ModelService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.model.currentUser) {
      console.log('no current user exist')
      return;
    }
    const user = this.model.getOrCreateUser(this.model.currentUser.id);
    this.employeeIdIn = null;
    this.employeeIdIn = user.id;
    this.nameIn = user.name;
    console.log(this.nameIn);
  }

  loginAction() {
    const date = new Date().toISOString();
    const user = this.model.user_data(this.employeeIdIn, this.nameIn, date);
    this.model.currentUser_data(user);
    console.log(`storing ${this.model.currentUser.name}`);
    this.router.navigate(['/shop']).then(r => console.log('login user'));
  }

}
