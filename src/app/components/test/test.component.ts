import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {WindowService} from '../../services/window.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  windowRef: any;
  constructor(public fb: FormBuilder, public authService: AuthenticationService, public win: WindowService) {

  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container').render().then(value => {
      console.log(value);
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return this.windowRef.recaptchaVerifier
  }

}
