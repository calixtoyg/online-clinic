import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {CalendarService} from '../../services/calendar.service';
import {Appointment} from '../../model/appointment';
import {Value} from '@angular/fire/remote-config';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-write-comments-modal',
  templateUrl: './write-comments-modal.component.html',
  styleUrls: ['./write-comments-modal.component.css']
})
export class WriteCommentsModalComponent implements OnInit {
  @Input() questions: string[];
  @Input() email: string;
  @Input() calendarId: string;
  @Input() appointment: Appointment;
  questionsForms: FormGroup;


  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.questionsForms = this.fb.group({});
    this.questions.forEach((value, i) => this.questionsForms.addControl('question_' + i, new FormControl('', Validators.required)));
  }

  saveAnswers() {
    const questionsAndAnswers = this.questions.map((value, index) => {
      return {
        question: value,
        answer: this.questionsForms.get('question_' + index).value
      };
    });
    // console.log(questionsAndAnswers);
    //
    this.calendarService.getCalendarById(this.calendarId).then(calendar => {
        const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments.filter(app => app.email === this.email && app.hour === this.appointment.hour));
        const indexOfAppointment = calendar.schedule[index].appointments
          .findIndex(findAppointment => findAppointment.hour === this.appointment.hour && findAppointment.email === this.appointment.email);
        calendar.schedule[index].appointments[indexOfAppointment] = {...this.appointment, questionsAndAnswers};
        this.calendarService.saveCalendar(calendar, this.calendarId).then(v => {
          this.activeModal.close({successful: true, message: 'Comments have been saved'});
        }).catch(e => {
          this.activeModal.close({successful: false, message: 'There was a problem during comments saving'});
        });
      }
    );
  }


}
