import { Component, OnInit } from '@angular/core';
import { loginUrl }  from '../../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  public loginUrl = loginUrl;

  constructor() { }

  ngOnInit(): void {
  }

}
