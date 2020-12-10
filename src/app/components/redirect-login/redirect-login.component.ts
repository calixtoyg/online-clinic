import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {UsersService} from '../../services/users.service';
import {Role} from '../../enum/role.enum';
import {Subject, Subscription} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-redirect-login',
  templateUrl: './redirect-login.component.html',
  styleUrls: ['./redirect-login.component.css']
})
export class RedirectLoginComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  loginForm: FormGroup;
  @ViewChild('alert',  {static: false}) alert: NgbAlert;
  alertMessage: string;
  alertType: string;
  private alertSubscription = new Subject<any>();

  constructor(private fb: FormBuilder, public authentication: AuthenticationService, private router: Router, private usersService: UsersService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.alertSubscription.subscribe(({message, successful}) => {
      this.alertMessage = message;
      this.alertType =  successful ? 'success' : 'danger';
    });
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }


  login(): void {
    if (this.loginForm.valid) {
      this.authentication
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          this.subs.push(this.usersService.getUserByMail(this.loginForm.value.email).subscribe(value => {
            localStorage.setItem('role', value.profile);
            localStorage.setItem('email', value.email);
            if (value.profile === Role.PATIENT) {
              this.router.navigate(['/welcome/patient']);
            } else if (value.profile === Role.MEDIC || value.profile === Role.PROFESSIONAL) {
              this.router.navigate(['/welcome/professional']);
            } else if (value.profile === Role.ADMIN) {
              this.router.navigate(['/welcome/admin']);
            }

          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  forgotPassword() {
    const modalRef = this.modalService.open(ForgotPasswordComponent);
    modalRef.componentInstance.email = this.loginForm.value.email || '';
    modalRef.result.then(value => {
      this.alertSubscription.next(value);

    });
  }

}
