import {Component, Input, OnInit} from '@angular/core';
import {Appointment} from '../../model/appointment';
import App = firebase.app.App;
import {Observable} from 'rxjs';
import {CalendarService} from '../../services/calendar.service';
import {map} from 'rxjs/operators';
import {ShowReviewModalComponent} from '../show-review-modal/show-review-modal.component';
import {WriteReviewModalComponent} from '../write-review-modal/write-review-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppointmentDTO} from '../../model/appointment-dto';
import {WriteCommentsModalComponent} from '../write-comments-modal/write-comments-modal.component';
import {Questions} from '../../enum/questions.enum';
import {Calendar} from '../../model/calendar';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-today-appointments-patients',
  templateUrl: './today-appointments-patients.component.html',
  styleUrls: ['./today-appointments-patients.component.css'],
  providers: [DatePipe]
})
export class TodayAppointmentsPatientsComponent implements OnInit {
  appointments: Observable<AppointmentDTO[]>;
  @Input() email: string;
  questions = [Questions.GOOD_ATTENTION,
    Questions.WAS_IT_QUICK,
    Questions.WAS_THE_PLACE_CLEAN];

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
                    date: new Date(calendar.year, calendar.month, calendar.day, Number(hoursAndMinutes[0]), Number(hoursAndMinutes[1]))
                  } as AppointmentDTO;
                }
              })))
        .filter(value => value))
    );
  }


  getIconProfessional({appointment}: AppointmentDTO): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'pending_action';
    } else if (appointment.acceptedByProfessional === false) {
      return 'clear';
    } else if (appointment.acceptedByProfessional === true) {
      return 'green-icon';
    }
  }

  getClassAcceptedByProfessional({appointment}: AppointmentDTO): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'black';
    } else if (appointment.acceptedByProfessional === false) {
      return 'cancelled';
    } else if (appointment.acceptedByProfessional === true) {
      return 'green-icon';
    }
  }

  getClassAcceptedByPatient({appointment}: AppointmentDTO): string {
    if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
      return 'black';
    } else if (appointment.acceptedByPatient === false) {
      return 'cancelled';
    } else if (appointment.acceptedByPatient === true) {
      return 'green-icon';
    }
  }

  getIconAcceptedByProfessional({appointment}: AppointmentDTO): string {
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

  getIconAcceptedByPatient({appointment}: AppointmentDTO): string {
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

  getPatientTooltip({appointment}: AppointmentDTO): string {
    if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
      return 'Appoint is pending acceptance';
    } else if (appointment.acceptedByPatient === false) {
      return 'Appointment has been rejected by the patient';
    } else if (appointment.acceptedByPatient === true) {
      return 'Appointment has been accepted by the patient';
    }
  }


  getProfessionalTooltip({appointment}: AppointmentDTO): string {
    if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
      return 'Appoint is pending acceptance';
    } else if (appointment.acceptedByProfessional === false) {
      return 'Appointment has been rejected by the medic';
    } else if (appointment.acceptedByProfessional === true) {
      return 'Appointment has been accepted by the medic';
    }
  }

  getDoneTooltip({appointment}: AppointmentDTO): string {
    if (appointment.done === true) {
      return 'Appoint has been completed';
    } else if (!appointment.done || appointment.done === false) {
      return 'Appointment has been completed';
    }
  }

  getDoneIcon({appointment}: AppointmentDTO): string {
    if (appointment.done === true) {
      return 'done';
    } else if (!appointment.done || appointment.done === false) {
      return 'pending';
    }
  }

  getDoneClass({appointment}: AppointmentDTO): string {
    if (appointment.done === true) {
      return 'green-icon';
    } else if (!appointment.done || appointment.done === false) {
      return 'black';
    }
  }

  showReview({appointment}: AppointmentDTO): void {

    const modalRef = this.modalService.open(ShowReviewModalComponent);
    modalRef.componentInstance.email = appointment.email;
    modalRef.componentInstance.review = appointment.review;
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
  }

  saveAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, done: true};
        this.calendarService.saveCalendar(calendar, calendarId);
      }
    );
  }

  cancelAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByPatient: false};
        this.calendarService.saveCalendar(calendar, calendarId);
      }
    );
  }

  acceptAppointment({appointment, calendarId}: AppointmentDTO): void {
    this.calendarService.getCalendarById(calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByPatient: true};
        this.calendarService.saveCalendar(calendar, calendarId);
      }
    );
  }

}
