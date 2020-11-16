import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginSuccessful: boolean;

  constructor(public activeModal: NgbActiveModal, fb: FormBuilder, public authentication: AuthenticationService) {
    this.loginForm = fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    console.log('hola')
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authentication
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          this.loginSuccessful = true;
          this.activeModal.close(true);
        })
        .catch((error) => {
          this.loginSuccessful = false;
          this.activeModal.close(false);
        });
    }
  }
}
