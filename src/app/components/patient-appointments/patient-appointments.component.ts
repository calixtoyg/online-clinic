import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent implements OnInit {
  email: string;

  constructor() { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
  }

}
