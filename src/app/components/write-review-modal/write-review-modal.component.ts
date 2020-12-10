import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Appointment} from '../../model/appointment';
import {CalendarService} from '../../services/calendar.service';
import {Observable, Subject} from 'rxjs';
import {DoctorsReview} from '../../model/doctors-review';

@Component({
  selector: 'app-write-review-modal',
  templateUrl: './write-review-modal.component.html',
  styleUrls: ['./write-review-modal.component.css']
})
export class WriteReviewModalComponent implements OnInit {
  reviewForm: FormGroup;
  disableSubmit: boolean;
  @Input() calendarId: string;
  @Input() appointment: Appointment;
  fields: { id: number, key?: string, value?: string }[] = [];

  private addedFields = 0;
  innerHtmlFields: string;
  @Input() readOnly: boolean;
  // @Input() review: DoctorsReview = {
  //   age: undefined,
  //   additionalInfo: undefined,
  //   pressure: undefined,
  //   temperature: undefined,
  //   freeText: undefined
  // };
  @Input() review: DoctorsReview;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      freeText: ['',],
      age: ['', [Validators.required, Validators.min(1), Validators.max(140)]],
      temperature: ['', [Validators.required, Validators.min(20), Validators.max(45)]],
      pressure: new FormControl('')
    });
    if (this.review) {
      this.fields = Object.keys(this.review.additionalInfo).map((value, index) => {
        return {
          id: index, key: value, value: this.review.additionalInfo[value]
        };
      });
      this.fields.forEach(value => {
        this.reviewForm.addControl(this.getKey(value.id), new FormControl(value.key));
        this.reviewForm.addControl(this.getValue(value.id), new FormControl(value.value));
      });

      console.log(this.review);

    }
  }

  submit(): void {

    if (this.reviewForm.valid) {
      console.log({...this.reviewForm.value});
      console.log('PRINTEO FIELDS:', this.fields);

      console.log(this.calendarId);

      const review: DoctorsReview = {
        age: this.reviewForm.get('age').value,
        freeText: this.reviewForm.get('freeText').value,
        pressure: this.reviewForm.get('pressure').value,
        temperature: this.reviewForm.get('temperature').value
      };
      review.additionalInfo = this.fields.map(value => {
        return {
          [value.key]: value.value
        };
      }).reduce((memo, value) => Object.assign(memo, value), {});

      console.log(review);
      console.log(review);
      console.log(review);

      // const review: DoctorsReview = Object.keys({...this.reviewForm.value}).map((value, index, array) => {
      //   if (value.startsWith('addedFieldKey')) {
      //     return {value[value]}
      //   }
      // })

      // const review: DoctorsReview = Object.keys({...this.reviewForm.value}).map((value, index, array) => {
      //   if (value.startsWith('addedFieldKey')) {
      //     return {value[value]}
      //   }
      // })
      this.calendarService.getCalendarById(this.calendarId).then(calendar => {
          const index: number = calendar.schedule?.findIndex(eachSchedule => eachSchedule.appointments
            .filter(app => app.email === this.appointment.email && app.hour === this.appointment.hour));
          const indexOfAppointment = calendar.schedule[index].appointments
            .findIndex(findAppointment =>
              findAppointment.hour === this.appointment.hour && findAppointment.email === this.appointment.email);
          calendar.schedule[index].appointments[indexOfAppointment] = {...this.appointment, review};
          this.calendarService.saveCalendar(calendar, this.calendarId).then(v => {
            this.activeModal.close({successful: true, message: 'Review have been saved'});
          }).catch(e => {
            this.activeModal.close({successful: false, message: 'There was a problem during review saving'});
          });
        }
      );
    }
  }

  addField(): void {
    this.reviewForm.addControl(`addedFieldKey-${this.addedFields}`, new FormControl(''));
    this.reviewForm.addControl(`addedFieldValue-${this.addedFields}`, new FormControl(''));
    this.fields.push(
      {
        id: this.addedFields,
        key: '',
        value: ''
      }
    );

    this.addedFields += 1;
  }

  removeField(addedField: number): void {
    this.reviewForm.removeControl(this.getKey(addedField));
    this.reviewForm.removeControl(this.getValue(addedField));
    this.fields = this.fields.filter(value => value.id !== addedField);
  }

  getKey(addedField: number): string {
    return `addedFieldKey-${addedField}`;
  }

  getValue(addedField: number): string {
    return `addedFieldValue-${addedField}`;
  }

}
