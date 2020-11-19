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
import {ShowCommentAndAnswersComponent} from '../show-comment-and-answers/show-comment-and-answers.component';
import {Questions} from '../../enum/questions.enum';
import {WriteCommentsModalComponent} from '../write-comments-modal/write-comments-modal.component';
import {AppointmentDTO} from '../../model/appointment-dto';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-today-appointments',
  templateUrl: './today-appointments.component.html',
  styleUrls: ['./today-appointments.component.css'],
  providers: [DatePipe]
})
export class TodayAppointmentsComponent implements OnInit {
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
            .find(value => value)?.appointments
          ));
    }
  }

  saveAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, done: !appointment.done};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  cancelAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: false};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  acceptAppointment(appointment: Appointment): void {
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === appointment.hour && findAppointment.email === appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...appointment, acceptedByProfessional: true};
        this.calendarService.saveCalendar(calendar, this.calendarId);
      }
    );
  }

  showReview({review, email}: Appointment): void {

    const modalRef = this.modalService.open(ShowReviewModalComponent);
    modalRef.componentInstance.email =  email;
    modalRef.componentInstance.review = review;
  }

  writeReview(): void {
    const modalRef = this.modalService.open(WriteReviewModalComponent);
  }

  writeComment(appointment: Appointment): void {
    const modalRef = this.modalService.open(WriteCommentsModalComponent);
    modalRef.componentInstance.questions = this.questions;
    modalRef.componentInstance.appointment = appointment;
    modalRef.componentInstance.calendarId = this.calendarId;
  }

  showComment({comment, email, answers}: Appointment): void {
    const modalRef = this.modalService.open(ShowCommentAndAnswersComponent);
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.questions = this.questions;
    modalRef.componentInstance.answers = answers;
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

  getClassAcceptedByPatient({appointment}: AppointmentDTO): string {
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
      return 'Appointment has been completed';
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
}
