import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CalendarService} from '../../services/calendar.service';
import {PartOfDay} from '../../enum/part-of-day.enum';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-possible-dates',
  templateUrl: './possible-dates.component.html',
  styleUrls: ['./possible-dates.component.css'],
  providers: [DatePipe]
})
export class PossibleDatesComponent implements OnInit, OnChanges {

  constructor(private calendarService: CalendarService, private datePipe: DatePipe) {
  }

  hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  daysInLetters = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  @Input() professionalEmail: string;
  @Input() days = 3;

  @Input() options = 3;
  @Input() partOfDay: PartOfDay;
  @Input() year: number;
  @Output() selectedDate = new EventEmitter<Date>();
  dates: any;
  private today = new Date();
  emptyArrays: boolean;

  private static getNextAvailableDay(today: Date): Date {
    const date = new Date(today);
    if (date.getDay() === 5) {
      return new Date(date.setDate(date.getDate() + 3));
    }
    return new Date(date.setDate(date.getDate() + 1));
  }

  ngOnInit(): void {
    console.log('INIT possible-dates-component professionalEmail: ', this.professionalEmail);
    if (!!this.professionalEmail) {
      this.showPossibleDates();
    }
    this.hours = this.partOfDay === PartOfDay.MORNING ? this.hours.slice(0, 9) : this.hours.slice(9, this.hours.length);
  }


  showPossibleDates(): Subscription {
    if (!!this.professionalEmail) {
      return this.calendarService.getCalendarsByYear(this.year).subscribe(calendars => {
        console.log(calendars);
        const dayWithAppointments = calendars
          .map(calendar =>
            calendar.schedule
              .filter(schedule => schedule.medicId === this.professionalEmail)
              .find(value => !!value)?.appointments?.map(appointment => {
              return {
                year: calendar.year,
                day: calendar.day,
                month: calendar.month,
                ...appointment
              };
            })
          ).filter(value => value && value.length > 0).flat();
        console.log('dayWithAppointments: ', dayWithAppointments);
        //

        // this.dates = this.getPossibleDates(dayWithAppointments);
        this.dates = this.getPossibleDates(dayWithAppointments);
        // this.emptyArrays = possibleDates.flat().length > 0;
        // console.log(arr);

        // return dayWithAppointments.map(value => new Date(value.year, value.month, value.day, ))
      });
    }
  }

  private getToday(): Date {

    if (this.today.getDay() === 6) {
      return new Date(new Date().setDate(this.today.getDate() + 2));
    }
    if (this.today.getDay() === 0) {
      return new Date(new Date().setDate(this.today.getDate() + 1));
    }
    return this.today;

  }

  emitDate(date: Date): void {
    this.selectedDate.emit(date);
  }

  private getPossibleDates(dayWithAppointments: FlatArray<{
    month: number; hour: string; year: number;
    day: number; email: string
  }[][], 1>[]): Date[] {
    const possibleDatesArray = [];
    let today = this.getToday();


    for (let i = 0; i < this.days; i++) {
      // const hoursSlice = this.partOfDay === PartOfDay.MORNING ? this.hours.slice(0, 9) : this.hours.slice(9, this.hours.length);
      const hoursSlice = this.getHoursFromNow(today);
      const possibleDates = [];
      const appointmentsForTheDay = dayWithAppointments
        .filter(eachDayWithAppointments => eachDayWithAppointments.day === today.getDate());
      const freeHours = hoursSlice
        .filter(hourString => !appointmentsForTheDay.map(appointmentForTheDay => appointmentForTheDay.hour).includes(hourString));
      for (let j = 0; j < this.options; j++) {
        if (freeHours[j]) {
          const hourAndMinuteSplit = freeHours[j].split(':');
          possibleDates
            .push(
              new Date(
                today.getFullYear(), today.getMonth(), today.getDate(), Number(hourAndMinuteSplit[0]), Number(hourAndMinuteSplit[1])
              )
            );
        }
      }
      possibleDatesArray.push({
        day: today,
        dates: possibleDates
      });

      today = PossibleDatesComponent.getNextAvailableDay(today);


    }
    return possibleDatesArray;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.showPossibleDates(); // here you will get the data from parent once the input param is change
  }

  private getHoursFromNow(compareAgainst: Date): string[] {
    const hoursDateAndPartOfTheDay = this.hours.map(value => {
      const hoursAndMinutes = value.split(':');
      return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), Number(hoursAndMinutes[0]), Number(hoursAndMinutes[1]));
    });
    const hoursIndex = hoursDateAndPartOfTheDay.findIndex(value => {
      return value > compareAgainst;
    });
    if (hoursIndex === -1 && this.compareDates(this.today, compareAgainst)) {
      return [];
    } else if (hoursIndex === -1) {
      return this.hours;
    }
    return this.hours.slice(hoursIndex, this.hours.length);
  }

  private compareDates(today: Date, compareAgainst: Date): boolean {
    return today.getFullYear() === compareAgainst.getFullYear() && today.getMonth() === compareAgainst.getMonth() && today.getDate() === compareAgainst.getDate();
  }
}

