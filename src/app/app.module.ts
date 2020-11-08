import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {MatListModule} from '@angular/material/list';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarHeaderComponent} from './components/navbar-header/navbar-header.component';
import {FooterComponent} from './components/footer/footer.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAnalyticsModule} from '@angular/fire/analytics';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {UsersComponent} from './components/users/users.component';
import {CreateUserModalComponent} from './components/create-user-modal/create-user-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './components/login/login.component';
import {TestComponent} from './components/test/test.component';
import {PatientsPipe} from './pipes/patients.pipe';
import {AppointmentsComponent} from './components/appointments/appointments.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PatientsComponent} from './components/patients/patients.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavbarHeaderComponent,
    FooterComponent,
    UsersComponent,
    CreateUserModalComponent,
    LoginComponent,
    TestComponent,
    PatientsPipe,
    AppointmentsComponent,
    PatientsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [MatNativeDateModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
