import {Component, Input, OnInit} from '@angular/core';
import {Appointment} from '../../model/appointment';
import {CalendarService} from '../../services/calendar.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {CreateUserModalComponent} from '../create-user-modal/create-user-modal.component';
import {Profile} from '../../enum/profile.enum';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowReviewModalComponent} from '../show-review-modal/show-review-modal.component';
import {WriteReviewModalComponent} from '../write-review-modal/write-review-modal.component';

@Component({
  selector: 'app-today-appointments',
  templateUrl: './today-appointments.component.html',
  styleUrls: ['./today-appointments.component.css']
})
export class TodayAppointmentsComponent implements OnInit {
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() email: string;
  appointments: Observable<Appointment[]>;
  private calendarId: string;


  constructor(private calendarService: CalendarService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.year && this.month && this.day && this.email) {
      this.appointments = this.calendarService.getCalendarsByYearMonthDay({year: this.year, month: this.month, day: this.day})
        .pipe(
          tap(calendar => {
            this.calendarId = calendar[0].id;
          }),
          map(calendar => calendar[0].schedule
            .filter(schedule => schedule.medicId === this.email)
            .find(value => value).appointments
          ));
    }
  }

  saveAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, done: true};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  cancelAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: false};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  acceptAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: true};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  showReview({review, email}: Appointment) {

    const modalRef = this.modalService.open(ShowReviewModalComponent);
    modalRef.componentInstance.email =  email;
    modalRef.componentInstance.review = review;
  }

  writeReview({review, email}: Appointment) {
    const modalRef = this.modalService.open(WriteReviewModalComponent);
    modalRef.componentInstance.email =  email;
    modalRef.componentInstance.review = review;
  }

}
