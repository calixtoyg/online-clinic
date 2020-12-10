import {Component, OnInit, ViewChild} from '@angular/core';
import {AppointmentFilterTypes} from '../../enum/appointment-filter-types.enum';
import {MatCalendarCellClassFunction, MatDatepickerInputEvent, MatDateRangePicker} from '@angular/material/datepicker';
import {AppointmentFilter} from '../../model/appointment-filter';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent implements OnInit {
  email: string;
  filter: AppointmentFilter;
  todayToggle: boolean;
  startDate: Date;
  endDate: Date;
  @ViewChild('picker') picker: MatDateRangePicker<Date>;
  dateClass: MatCalendarCellClassFunction<Date>;

  constructor() {
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
  }

  setInput(filter: AppointmentFilterTypes) {
    this.todayToggle = !this.todayToggle;
    if (this.todayToggle) {
      this.filter = {filter};
    } else {
      this.filter = {filter: AppointmentFilterTypes.NO_FILTER};
    }
  }

  getTodayFilter(): AppointmentFilterTypes {
    return AppointmentFilterTypes.TODAY;
  }

  setDateclass($event: Date[]) {
    this.dateClass = (cellDate, view) => {
      if (view === 'month') {
        const date = cellDate.getDate();
        return ($event.find(eachDate =>
          eachDate.getFullYear() === cellDate.getFullYear()
          && eachDate.getMonth() === cellDate.getMonth()
          && eachDate.getDate() === cellDate.getDate()
        )) ? 'example-custom-date-class' : '';
      }
    };
  }

  setDate($event: Event): void {
    // console.log($event.value)
  }
}
