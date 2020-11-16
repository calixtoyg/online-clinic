import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {TestComponent} from './components/test/test.component';
import {PatientsComponent} from './components/patients/patients.component';
import {AppointmentsComponent} from './components/appointments/appointments.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {LoginComponent} from './components/login/login.component';
import {RedirectLoginComponent} from './components/redirect-login/redirect-login.component';
import {WelcomePatientComponent} from './components/welcome-patient/welcome-patient.component';
import {WelcomeAdminComponent} from './components/welcome-admin/welcome-admin.component';
import {WelcomeProfessionalComponent} from './components/welcome-professional/welcome-professional.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: 'welcome', component: WelcomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},

  },
  {
    path: 'welcome/professional', component: WelcomeProfessionalComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    pathMatch: 'full'
  },
  {
    path: 'welcome/patient', component: WelcomePatientComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    pathMatch: 'full'
  },
  {
    path: 'welcome/admin',
    component: WelcomeAdminComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    pathMatch: 'full'
  },
  {
    path: 'patient', component: PatientsComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'appointments', component: AppointmentsComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'test', component: TestComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'login', component: RedirectLoginComponent
  },
  {path: '**', component: RedirectLoginComponent},

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
