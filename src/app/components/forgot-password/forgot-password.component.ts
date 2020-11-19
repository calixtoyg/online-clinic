import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input() email: string;
  emailForm: FormGroup;
  mailSent: boolean;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({email: [this.email, Validators.email]});
  }

  forgotPassword() {
    // this.authService.forgotPassword(this.emailForm.value.email)
    //   .then(value => {
    //     this.activeModal.close({successful: true, message: 'Email sent successfully'});
    //     }
    //   ).catch(error => {
    //   this.activeModal.close({successful: false, message: error.message});
    // });
    this.activeModal.close({successful: true, message: 'Email sent successfully'})
  }
}
