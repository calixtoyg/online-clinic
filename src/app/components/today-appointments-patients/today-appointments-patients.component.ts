import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {CalendarService} from '../../services/calendar.service';
import {map, tap} from 'rxjs/operators';
import {WriteReviewModalComponent} from '../write-review-modal/write-review-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppointmentDTO} from '../../model/appointment-dto';
import {WriteCommentsModalComponent} from '../write-comments-modal/write-comments-modal.component';
import {Questions} from '../../enum/questions.enum';
import {Calendar} from '../../model/calendar';
import {DatePipe} from '@angular/common';
import {SortableDirective, SortEvent} from '../../directives/sortable.directive';
import {AppointmentFilter} from '../../model/appointment-filter';
import {Appointment} from '../../model/appointment';

@Component({
  selector: 'app-today-appointments-patients',
  templateUrl: './today-appointments-patients.component.html',
  styleUrls: ['./today-appointments-patients.component.css'],
  providers: [DatePipe]
})
export class TodayAppointmentsPatientsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() email: string;
  @Input() filter: AppointmentFilter;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  appointments: Observable<AppointmentDTO[]>;
  questions = [Questions.GOOD_ATTENTION,
    Questions.WAS_IT_QUICK,
    Questions.WAS_THE_PLACE_CLEAN];
  alertMessage: string;
  alertType: string;
  subscriptions: Subscription[] = [];
  private alertSubscription = new Subject<any>();
  appointmentsCopy: Observable<AppointmentDTO[]>;
  @Output() allDates = new EventEmitter<Date[]>();


  constructor(private calendarService: CalendarService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appointments = this.calendarService.getCalendarsByYear(new Date().getFullYear()).pipe(
      map(calendars => calendars
        .flatMap(
          calendar => calendar.schedule
            .flatMap(schedule => schedule.appointments
              .flatMap(appointment => {
                if (appointment.email === this.email) {
                  const hoursAndMinutes = appointment.hour.split(':');
                  return {
                    appointment,
                    calendarId: calendar.id,
                    date: new Date(calendar.year, calendar.month, calendar.day, Number(hoursAndMinutes[0]), Number(hoursAndMinutes[1])),
                    medicName: schedule.medicName,
                  } as AppointmentDTO;
                }
              })))
        .filter(value => value))
    ).pipe(tap(
      value => {
        this.allDates.emit(value.map(date => date.date));
      }
    ));


    this.subscriptions.push(this.alertSubscription.subscribe(({message, successful}) => {
      this.alertMessage = message;
      this.alertType = successful ? 'success' : 'danger';
    }));
  }

  showReview(appointment: AppointmentDTO): void {

    const modalRef = this.modalService.open(WriteReviewModalComponent);
    modalRef.componentInstance.email = appointment.medicName;
    modalRef.componentInstance.review = appointment.appointment.review;
    modalRef.componentInstance.readOnly = true;
  }

  writeReview({appointment, calendarId}: AppointmentDTO): void {
    const modalRef = this.modalService.open(WriteReviewModalComponent);
    modalRef.componentInstance.calendarId = calendarId;
    modalRef.componentInstance.appointment = appointment;
  }

  writeComment({appointment, calendarId}: AppointmentDTO): void {
    const modalRef = this.modalService.open(WriteCommentsModalComponent);
    modalRef.componentInstance.questions = this.questions;
    modalRef.componentInstance.appointment = appointment;
    modalRef.componentInstance.calendarId = calendarId;
    modalRef.result.then((value) => {
      this.alertSubscription.next(value);
    }).catch((error) => {
      this.alertSubscription.next(error);
    });

  }

  saveAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, done: true};
        this.saveCalendar(calendar, calendarId);
      }
    );
  }

  cancelAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByPatient: false};
        this.saveCalendar(calendar, calendarId);
      }
    );
  }

  acceptAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByPatient: true};
        this.saveCalendar(calendar, calendarId);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private saveCalendar(calendar: Calendar, calendarId: string): void {
    this.calendarService.saveCalendar(calendar, calendarId).then(value => {
      this.alertSubscription.next({successful: true, message: 'Saved appointment'});
    }).catch(error => {
      this.alertSubscription.next({successful: false, message: 'Error during saving of appointment'});
    });
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    console.log(arguments);

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // this.service.sortColumn = column;
    // this.service.sortDirection = direction;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter.currentValue) {
        this.filter = changes.filter.currentValue;
    }

    // filter(value => value
    //   .filter(eachDTO =>
    //     today.getFullYear() === eachDTO.date.getFullYear()
    //     && today.getMonth() === eachDTO.date.getMonth()
    //     && today.getDate() === eachDTO.date.getDate()
    //   )));
  }


  isAccepted(appointment: Appointment) {
    return appointment.acceptedByProfessional === true;
  }

  isAcceptedByPatient(appointment: Appointment) {
    return appointment.acceptedByPatient === true;
  }

  isAcceptedOrCancelled(appointment: Appointment) {
    return typeof appointment.acceptedByProfessional === 'boolean';
  }
}
