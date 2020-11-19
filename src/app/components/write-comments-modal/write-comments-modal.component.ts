import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {CalendarService} from '../../services/calendar.service';
import {Appointment} from '../../model/appointment';
import {Value} from '@angular/fire/remote-config';

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
    const questionAnswers = [];
    Object.entries(this.questionsForms.value).forEach(([key, value]) => questionAnswers.push(value));
    console.log(questionAnswers);
    // this.calendarService.getCalendarById(this.calendarId).then(calendar => {
    //     const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.email);
    //     const indexOfAppointment = calendar.schedule[index].appointments
    //       .findIndex(findAppointment => findAppointment.hour === this.appointment.hour && findAppointment.email);
    //     calendar.schedule[index].appointments[indexOfAppointment] = {...this.appointment, acceptedByProfessional: true};
    //     this.calendarService.saveCalendar(calendar, this.calendarId);
    //   }
    // );

  }
}
