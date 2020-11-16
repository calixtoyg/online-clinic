import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Speciality} from '../../enum/speciality.enum';
import {MatStepper, MatVerticalStepper} from '@angular/material/stepper';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {UsersService} from '../../services/users.service';
import {UserCreation} from '../../model/user-creation';
import {Observable} from 'rxjs';
import {Profile} from '../../enum/profile.enum';
import {Calendar} from '../../model/calendar';
import {MatOptionSelectionChange} from '@angular/material/core';
import {map, mergeMap, startWith, tap} from 'rxjs/operators';
import {CalendarService} from '../../services/calendar.service';
import {Schedule} from '../../model/schedule';
import {Appointment} from '../../model/appointment';
import {PartOfDay} from '../../enum/part-of-day.enum';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers: [DatePipe]
})
export class AppointmentsComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private calendarService: CalendarService, private datePipe: DatePipe) {
  }

  year = new Date().getFullYear();
  isLinear: boolean;
  specialities: any[];
  specialityForm: FormGroup;
  professionalForm: FormGroup;
  professionals: Observable<UserCreation[]>;
  patients: Observable<UserCreation[]>;
  hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  specialityMessage = 'Choose speciality';
  professionalMessage = 'Select professional';
  dateForm: FormGroup;
  loadingSpinner: boolean;
  hourForm: FormGroup;
  patientForm: FormGroup;
  patientName: string;
  filteredPatients: Observable<UserCreation[]>;
  calendar: Calendar;
  calendars: Observable<Calendar[]>;
  professionalEmail: Observable<string>;
  chooseAnotherDate: boolean;
  @ViewChild('stepper') stepper: MatStepper;

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;

  };


  ngOnInit(): void {
    this.specialityForm = this.formBuilder.group({
      speciality: ['', Validators.required]
    });
    this.professionalForm = this.formBuilder.group({
      professional: ['', Validators.required],
      id: ['', Validators.required]
    });
    this.dateForm = this.formBuilder.group({
      appointmentDate: ['', Validators.required]
    });
    this.hourForm = this.formBuilder.group({
      appointmentHour: ['', Validators.required]
    });
    this.patientForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required])
    });
    this.specialities = Object.keys(Speciality).map(
      value => Speciality[value][0].toUpperCase() + Speciality[value].slice(1, Speciality[value].length
      ));
    this.professionals = this.usersService.getUserWithProfile(Profile.MEDIC);
    this.patients = this.usersService.getUserWithProfile(Profile.PATIENT);
    this.filteredPatients = this.patientForm.get('email').valueChanges.pipe(
      startWith(''),
      tap(patientName => {
        this.patientName = patientName;
      }),
      map(value => this._filter(value))
    ).pipe(
      mergeMap(value => value)
    );

    this.specialityForm.get('speciality').valueChanges.subscribe(value => {
      this.professionals = this.professionals.pipe(map(pros => {
        return pros.filter(({specializations}) => specializations.includes(value.toLowerCase()));
      }));
    });
    this.calendars = this.calendarService.getCalendarsByYear(new Date().getFullYear());

    this.professionalEmail = this.professionalForm.get('id').valueChanges;

  }


  setSpeciality(speciality: string): void {
    this.specialityForm.setValue({speciality});
    this.specialityMessage = speciality;
    this.stepper.next();
  }

  setProfessional(professional: any): void {
    this.professionalForm.setValue({professional: professional.name, id: professional.email});
    this.professionalMessage = professional.name;
    this.stepper.next();
  }

  setDate($event: MatDatepickerInputEvent<Date, unknown>, stepper: MatVerticalStepper): void {
    this.dateForm.setValue({appointmentDate: $event.value});
    this.setFilteredHours($event);
    stepper.next();
  }

  setDateForPossibleDates($event): void {
    let appointmentHour;
    appointmentHour = this.datePipe.transform($event, 'HH:mm');
    this.dateForm.setValue({appointmentDate: $event});
    // @ts-ignore
    this.setFilteredHours({value: $event});
    this.hourForm.setValue({appointmentHour});
    this.nextStep();
    this.nextStep();
  }

  private setFilteredHours($event: MatDatepickerInputEvent<Date, unknown>): void {
    this.calendars.subscribe(calendar => {
      this.calendar = calendar
        .filter(months => months.month === $event.value.getMonth() &&
          months.year === new Date().getFullYear() &&
          months.day === $event.value.getDate())
        .find(value => value);
      this.hours = this.getAppointments();
    });
  }

  private getAppointments(): string[] {
    const {appointments} = this.calendar?.schedule?.find(value => value.medicId === this.professionalForm.value.id) || {};
    const appointmentHours = appointments?.map(value => value.hour);
    return appointments ? this.hours.filter(hour => !appointmentHours.includes(hour)) : this.hours;
  }

  setHour(appointmentHour: string): void {
    this.hourForm.setValue({appointmentHour});
    this.stepper.next();
  }

  private _filter(value: string): Observable<UserCreation[]> {
    const filterValue = value.toLowerCase();
    return this.patients.pipe(map(patients => patients.filter(option => option.email.indexOf(filterValue) === 0)));
  }


  saveAppointment(): void {
    this.loadingSpinner = true;
    // TODO check all forms are valid first
    let savingCalendar = {} as Calendar;
    const index: number = this.calendar?.schedule?.findIndex(eachSchedule => eachSchedule.medicId === this.professionalForm.value.id);
    const hour = this.hourForm.get('appointmentHour').value;
    const email = this.patientForm.get('email').value;
    if (index !== -1 && index !== undefined) {
      savingCalendar = this.calendar;
      const medicSchedule: Schedule = this.calendar.schedule[index];

      // @ts-ignore
      medicSchedule.appointments = [...medicSchedule.appointments, {email, hour}];
      savingCalendar.schedule[index] = {
        medicName: this.professionalForm.value.professional,
        medicId: this.professionalForm.value.id,
        appointments: medicSchedule.appointments
      };
    } else {
      const date: Date = this.dateForm.get('appointmentDate').value;
      savingCalendar.day = date.getDate();
      savingCalendar.year = date.getFullYear();
      savingCalendar.month = date.getMonth();
      savingCalendar.schedule = new Array({
        appointments: new Array({hour, email} as Appointment),
        medicId: this.professionalForm.value.id,
        medicName: this.professionalForm.value.professional
      } as Schedule);
    }
    this.calendarService.saveCalendar(savingCalendar, this.calendar?.id).then(() => {
      // TODO disable loading spinner
      this.loadingSpinner = false;
      console.log('Calendar SAVED');
    }).catch(error => {
      this.loadingSpinner = false;
      console.error(error);
    });
  }

  nextStep(): void {
    this.stepper.next();
  }

  getAfternoon(): PartOfDay {
    return PartOfDay.AFTERNOON;
  }

  getMorning(): PartOfDay {
    return PartOfDay.MORNING;
  }

  toggleChooseAnotherDate(): void {
    this.chooseAnotherDate = !this.chooseAnotherDate;
  }
}
