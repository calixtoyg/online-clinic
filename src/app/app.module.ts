import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {PossibleDatesComponent} from './components/possible-dates/possible-dates.component';
import {RolePipe} from './pipes/role.pipe';
import {RedirectLoginComponent} from './components/redirect-login/redirect-login.component';
import {WelcomePatientComponent} from './components/welcome-patient/welcome-patient.component';
import {WelcomeAdminComponent} from './components/welcome-admin/welcome-admin.component';
import {WelcomeProfessionalComponent} from './components/welcome-professional/welcome-professional.component';
import {TodayAppointmentsComponent} from './components/today-appointments/today-appointments.component';
import {HourPipe} from './pipes/hour.pipe';
import {ShowImageDirective} from './directives/show-image.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ShowReviewModalComponent} from './components/show-review-modal/show-review-modal.component';
import {WriteReviewModalComponent} from './components/write-review-modal/write-review-modal.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {PatientAppointmentsComponent} from './components/patient-appointments/patient-appointments.component';
import {ShowCommentAndAnswersComponent} from './components/show-comment-and-answers/show-comment-and-answers.component';
import {WriteCommentsModalComponent} from './components/write-comments-modal/write-comments-modal.component';
import {TodayAppointmentsPatientsComponent} from './components/today-appointments-patients/today-appointments-patients.component';
import {SortableDirective} from './directives/sortable.directive';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FilterPatientsPipe} from './pipes/filter-patients.pipe';
import {EmailPipe} from './pipes/email.pipe';
import {MedicAcceptedPipe} from './pipes/medic-accepted.pipe';
import {PatientAcceptedPipe} from './pipes/patient-accepted.pipe';
import {DonePipe} from './pipes/done.pipe';
import {ProfessionalStatisticsComponent} from './components/professional-statistics/professional-statistics.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { HoldableDirective } from './directives/holdable.directive';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { TooltipPipe } from './pipes/tooltip.pipe';
import { IconPipe } from './pipes/icon.pipe';
import { ClassPipe } from './pipes/class.pipe';
import { CancelledByProfessionalPipe } from './pipes/CancelledByProfessional.pipe';
import { CancelledByPatientPipe } from './pipes/cancelled-by-patient.pipe';


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
    SpinnerComponent,
    PossibleDatesComponent,
    RolePipe,
    RedirectLoginComponent,
    WelcomePatientComponent,
    WelcomeAdminComponent,
    WelcomeProfessionalComponent,
    TodayAppointmentsComponent,
    HourPipe,
    ShowImageDirective,
    ShowReviewModalComponent,
    WriteReviewModalComponent,
    ForgotPasswordComponent,
    PatientAppointmentsComponent,
    ShowCommentAndAnswersComponent,
    WriteCommentsModalComponent,
    TodayAppointmentsPatientsComponent,
    SortableDirective,
    FilterPatientsPipe,
    EmailPipe,
    MedicAcceptedPipe,
    PatientAcceptedPipe,
    DonePipe,
    ProfessionalStatisticsComponent,
    BarChartComponent,
    HoldableDirective,
    DynamicPipe,
    TooltipPipe,
    IconPipe,
    ClassPipe,
    CancelledByProfessionalPipe,
    CancelledByPatientPipe,
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
    MatAutocompleteModule,
    MatListModule,
    MatDatepickerModule,
    MatChipsModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    ChartsModule,
  ],
  providers: [MatNativeDateModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
