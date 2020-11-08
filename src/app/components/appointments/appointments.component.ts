import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Speciality} from '../../enum/speciality.enum';
import {MatVerticalStepper} from '@angular/material/stepper';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  isLinear: boolean;
  specialities: any[];
  specialityForm: FormGroup;
  professionalForm: FormGroup;
  professionals = [
    {name: 'Juan Suarez', email: 'juansuarez@mailinator'},
    {name: 'Pedro Somoza', email: 'pedrosomoza@mailinator.com'},
    {name: 'Calixto Gonzalez', email: 'calixto.y.gonzalez@gmail.com'},
    {name: 'Joe Biden', email: 'joebiden@mailinator.com'},
    {name: 'Alvero Fernandez', email: 'alve@mailinator.com'},
    {name: 'Cristina Kirchner', email: 'cristina@mailinator.com'}
  ];
  hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '11:30', '12:00', '12:30'];
  specialityMessage = 'Choose speciality';
  professionalMessage = 'Select professional';
  dateForm: FormGroup;
  cont = 0;
  hourForm: FormGroup;
  mockedMonths = [
    {
      year: 2020,
      month: 10,
      day: 0,
      schedule: [
        {
          medicId: 'calixto.y.gonzalez@gmail.com',
          medicName: 'Calixto Gonzalez',
          appointments: [
            '08:00',
            '14:00'
          ]
        },
        {
          medicId: 'juanelmedico@mailinator.com',
          medicName: 'Juan El Medico',
          appointments: []
        }
      ]
    },
    {
      year: 2020,
      month: 10,
      day: 9,
      schedule: [
        {
          medicId: 'calixto.y.gonzalez@gmail.com',
          medicName: 'Calixto Gonzalez',
          appointments: [
            '08:00',
            '14:00'
          ]
        },
        {
          medicId: 'juanelmedico@mailinator.com',
          medicName: 'Juan El Medico',
          appointments: []
        }
      ]
    },
    {
      year: 2020,
      month: 10,
      day: 10,
      schedule: [
        {
          medicId: 'calixto.y.gonzalez@gmail.com',
          medicName: 'Calixto Gonzalez',
          appointments: [
            '08:00',
            '14:00',
            '15:30',
            '17:30',
            '20:00'
          ]
        },
        {
          medicId: 'juanelmedico@mailinator.com',
          medicName: 'Juan El Medico',
          appointments: []
        }
      ]
    },
    {
      year: 2020,
      month: 10,
      day: 11,
      schedule: [
        {
          medicId: 'calixto.y.gonzalez@gmail.com',
          medicName: 'Calixto Gonzalez',
          appointments: [
            '14:00'
          ]
        },
        {
          medicId: 'juanelmedico@mailinator.com',
          medicName: 'Juan El Medico',
          appointments: []
        }
      ]
    }
  ];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;

  };


  constructor(private formBuilder: FormBuilder) {
  }

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
    this.specialities = Object.keys(Speciality).map(value => Speciality[value][0].toUpperCase() + Speciality[value].slice(1, Speciality[value].length));
  }


  setSpeciality(speciality: string, stepper: MatVerticalStepper): void {
    this.specialityForm.setValue({speciality});
    this.specialityMessage = speciality;
    stepper.next();
  }

  setProfessional(professional: any, stepper: MatVerticalStepper): void {
    this.professionalForm.setValue({professional: professional.name, id: professional.email});
    this.professionalMessage = professional.name;
    stepper.next();
  }

  setDate($event: MatDatepickerInputEvent<unknown, unknown>, stepper: MatVerticalStepper) {
    this.dateForm.setValue({appointmentDate: $event.value});
    this.hours = this.getFilteredHours($event);
    stepper.next();
  }

  private getFilteredHours($event: MatDatepickerInputEvent<unknown, unknown>): [] {
    // TODO falta agregar el filtro para el objecto final.
    let test = this.mockedMonths.filter(months => {
      return months.month === $event.value.getMonth() && months.year === new Date().getFullYear() && months.day === $event.value.getDate();
    });
    this.professionalForm.value.id;
    return this.hours;
  }

  setHour(appointmentHour: string, stepper: MatVerticalStepper) {
    this.hourForm.setValue({appointmentHour});
    stepper.next();
  }
}
