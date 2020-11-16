import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {UsersService} from '../../services/users.service';
import {Role} from '../../enum/role.enum';
import {Subscription} from 'rxjs';
import {CalendarService} from '../../services/calendar.service';

@Component({
  selector: 'app-redirect-login',
  templateUrl: './redirect-login.component.html',
  styleUrls: ['./redirect-login.component.css']
})
export class RedirectLoginComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, public authentication: AuthenticationService, private router: Router, private usersService: UsersService) {
  }

  ngOnInit(): void {
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

}
