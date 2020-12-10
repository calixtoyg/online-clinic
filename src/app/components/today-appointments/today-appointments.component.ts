import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Appointment} from '../../model/appointment';
import {CalendarService} from '../../services/calendar.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowReviewModalComponent} from '../show-review-modal/show-review-modal.component';
import {WriteReviewModalComponent} from '../write-review-modal/write-review-modal.component';
import {ShowCommentAndAnswersComponent} from '../show-comment-and-answers/show-comment-and-answers.component';
import {Questions} from '../../enum/questions.enum';
import {WriteCommentsModalComponent} from '../write-comments-modal/write-comments-modal.component';
import {DatePipe} from '@angular/common';
import {Calendar} from '../../model/calendar';
import {AppointmentStatesFilter} from '../../model/appointment-states-filter';
import App = firebase.app.App;

@Component({
  selector: 'app-today-appointments',
  templateUrl: './today-appointments.component.html',
  styleUrls: ['./today-appointments.component.css'],
  providers: [DatePipe]
})
export class TodayAppointmentsComponent implements OnInit, OnDestroy, OnChanges {
  // TODO falta escribir preguntas y respuestas
  // capaz falta alguno en algunos de los modales de acciones.
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() email: string;
  appointments: Observable<Appointment[]>;
  private calendarId: string;
  questions = [Questions.GOOD_ATTENTION,
    Questions.WAS_IT_QUICK,
    Questions.WAS_THE_PLACE_CLEAN];

  alertMessage: string;
  alertType: string;
  subscriptions: Subscription[] = [];
  @Output() exportAppointments = new EventEmitter<any>();
  alertSubscription = new Subject<any>();
  @Input() wholeYear: boolean;
  @Input() filter: AppointmentStatesFilter[];


  constructor(private calendarService: CalendarService, private modalService: NgbModal) {
  }


  ngOnInit(): void {
    if (this.year && this.month && this.day && this.email) {
      this.appointments = this.calendarService.getCalendarsByYearMonthDay({year: this.year, month: this.month, day: this.day})
        .pipe(
          tap(calendar => {
            this.calendarId = calendar[0]?.id;
          }),
          map(calendar => calendar[0]?.schedule
            .filter(schedule => schedule.medicId === this.email)
            .find(value => value)?.appointments
          ));
      // this.appointments = this.calendarService.getCalendarsAppointmentsByYearMonthDay({
      //   year: this.year,
      //   month: this.month,
      //   day: this.day,
      //   email: this.email
      // });
      // this.appointments = this.calendarService.getCalendarsByYearMonthDay({year: this.year, month: this.month, day: this.day})
      //   .pipe(
      //     tap(calendar => {
      //       this.calendarId = calendar[0]?.id;
      //     }),
      //     map(calendar => calendar[0]?.schedule
      //       .filter(schedule => schedule.medicId === this.email)
      //       .find(value => value)?.appointments
      //     ));
    }
    if (this.wholeYear) {
      const today = new Date();
      this.appointments = this.calendarService.getCalendarsAppointmentsByYearAndProfessionalEmail(this.year, this.email).pipe(
        tap(appointments => {
            this.exportAppointments.emit(appointments);
          }
        )
      );
    }

    this.subscriptions.push(this.alertSubscription.subscribe(({message, successful}) => {
      this.alertMessage = message;
      this.alertType = successful ? 'success' : 'danger';
    }));
  }

  saveAppointment(appointment: Appointment): void {
    // @ts-ignore
    this.calendarService.getCalendarById(appointment.calendarId ? appointment.calendarId : this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, done: !appointment.done};
        // @ts-ignore
      this.saveCalendar(calendar, appointment.calendarId ? appointment.calendarId : this.calendarId);
      }
    );
  }

  cancelAppointment(appointment: Appointment): void {
    // @ts-ignore
    this.calendarService.getCalendarById(appointment.calendarId ? appointment.calendarId : this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: false};
        // @ts-ignore
        this.saveCalendar(calendar, appointment.calendarId ? appointment.calendarId : this.calendarId);
      }
    );
  }

  acceptAppointment(appointment: Appointment): void {
    // @ts-ignore
    this.calendarService.getCalendarById(appointment.calendarId ? appointment.calendarId : this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: true};
        // @ts-ignore
      this.saveCalendar(calendar, appointment.calendarId ? appointment.calendarId : this.calendarId);
      }
    );
  }

  // @ts-ignore
  showReview(appointment: Appointment): void {

    const modalRef = this.modalService.open(WriteReviewModalComponent);
    modalRef.componentInstance.email = appointment.email;
    modalRef.componentInstance.review = appointment.review;
    modalRef.componentInstance.appointment = appointment;
    // @ts-ignore
    modalRef.componentInstance.calendarId = appointment.calendarId ? appointment.calendarId : this.calendarId;
    modalRef.componentInstance.readOnly = false;
  }

  writeReview(appointment: Appointment): void {
    const modalRef = this.modalService.open(WriteReviewModalComponent);
    modalRef.componentInstance.appointment = appointment;
    // @ts-ignore
    modalRef.componentInstance.calendarId = appointment.calendarId ? appointment.calendarId : this.calendarId;
    modalRef.result.then(value => {
      this.alertSubscription.next(value);
    }).catch(error => {
      this.alertSubscription.next(error);
    });
  }

  writeComment(appointment: Appointment): void {
    const modalRef = this.modalService.open(WriteCommentsModalComponent);
    modalRef.componentInstance.questions = this.questions;
    modalRef.componentInstance.appointment = appointment;
    modalRef.componentInstance.calendarId = this.calendarId;
  }

  showComment(appointment: Appointment): void {
    const modalRef = this.modalService.open(ShowCommentAndAnswersComponent);
    modalRef.componentInstance.appointment = appointment;
  }

  getIconProfessional(appointment: Appointment): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'pending_action';
    } else if (appointment.acceptedByProfessional === false) {
      return 'clear';
    } else if (appointment.acceptedByProfessional === true) {
      return 'green-icon';
    }
  }

  getClassAcceptedByProfessional(appointment: Appointment): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'black';
    } else if (appointment.acceptedByProfessional === false) {
      return 'cancelled';
    } else if (appointment.acceptedByProfessional === true) {
      return 'green-icon';
    }
  }

  getClassAcceptedByPatient(appointment: Appointment): string {
    if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
      return 'black';
    } else if (appointment.acceptedByPatient === false) {
      return 'cancelled';
    } else if (appointment.acceptedByPatient === true) {
      return 'green-icon';
    }
  }

  getIconAcceptedByProfessional(appointment: Appointment): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'pending_action';
    } else if (appointment.acceptedByProfessional === false) {
      return 'clear';
    } else if (appointment.acceptedByProfessional === true && appointment.acceptedByPatient === true) {
      return 'done_all';
    } else if (appointment.acceptedByProfessional === true) {
      return 'check';
    }
  }

  getIconAcceptedByPatient(appointment: Appointment): string {
    if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
      return 'pending_action';
    } else if (appointment.acceptedByPatient === false) {
      return 'clear';
    } else if (appointment.acceptedByProfessional === true && appointment.acceptedByPatient === true) {
      return 'done_all';
    } else if (appointment.acceptedByPatient === true) {
      return 'check';
    }
  }

  getPatientTooltip(appointment: Appointment): string {
    if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
      return 'Appoint is pending acceptance';
    } else if (appointment.acceptedByPatient === false) {
      return 'Appointment has been rejected by the patient';
    } else if (appointment.acceptedByPatient === true) {
      return 'Appointment has been accepted by the patient';
    }
  }


  getProfessionalTooltip(appointment: Appointment): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'Appoint is pending acceptance';
    } else if (appointment.acceptedByProfessional === false) {
      return 'Appointment has been rejected by the medic';
    } else if (appointment.acceptedByProfessional === true) {
      return 'Appointment has been accepted by the medic';
    }
  }

  getDoneTooltip(appointment: Appointment): string {
    if (appointment.done === true) {
      return 'Appoint has been completed';
    } else if (!appointment.done || appointment.done === false) {
      return 'Appointment has not been completed yet';
    }
  }

  getDoneIcon(appointment: Appointment): string {
    if (appointment.done === true) {
      return 'done';
    } else if (!appointment.done || appointment.done === false) {
      return 'pending';
    }
  }

  getDoneClass(appointment: Appointment): string {
    if (appointment.done === true) {
      return 'green-icon';
    } else if (!appointment.done || appointment.done === false) {
      return 'black';
    }
  }

  private saveCalendar(calendar: Calendar, calendarId: string): void {
    this.calendarService.saveCalendar(calendar, calendarId).then(value => {
      this.alertSubscription.next({successful: true, message: 'Saved appointment'});
    }).catch(error => {
      this.alertSubscription.next({successful: false, message: 'Error during saving of appointment'});
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter && changes.filter.currentValue) {
      this.filter = changes.filter.currentValue;
    }
  }

  isAccepted(appointment: Appointment): boolean {
    console.log('entro mas veces de las q debias');
    return appointment.acceptedByProfessional === true;
  }

  isCancelled(appointment: Appointment): boolean {
    return appointment.acceptedByProfessional === false;
  }

  isAcceptedOrCancelled(appointment: Appointment) {
    return typeof appointment.acceptedByProfessional === 'boolean';
  }

  isAcceptedByPatient(appointment: Appointment) {
    return appointment.acceptedByPatient === true;
  }
}
