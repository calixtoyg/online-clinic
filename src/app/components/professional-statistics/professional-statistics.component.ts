import {Component, OnInit} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {CalendarService} from '../../services/calendar.service';
import {map, tap} from 'rxjs/operators';
import {AppointmentDTO} from '../../model/appointment-dto';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {Schedule} from '../../model/schedule';
import {Appointment} from '../../model/appointment';

@Component({
  selector: 'app-professional-statistics',
  templateUrl: './professional-statistics.component.html',
  styleUrls: ['./professional-statistics.component.css']
})
export class ProfessionalStatisticsComponent implements OnInit {
  private currentUserAppointments: Observable<AppointmentDTO[]>;
  private currentEmail: string;
  private yearDate: any;
  private appointmentsDoneMonthly = {data: [], label: 'Done'} as ChartDataSets;
  private appointmentsNotDoneMonthly = {data: [], label: 'Not Done'} as ChartDataSets;
  private pendingAppointmentsByProfessionalMonthly = {data: [], label: 'Pending by professional'} as ChartDataSets;
  private pendingAppointmentsByPatientMonthly = {data: [], label: 'Pending by patient'} as ChartDataSets;
  private acceptedAppointmentsByPatientMonthly = {data: [], label: 'Accepted by patient'} as ChartDataSets;
  private acceptedAppointmentsByProfessionalMonthly = {data: [], label: 'Accepted by professional'} as ChartDataSets;
  private rejectedAppointmentsByProfessionalMonthly = {data: [], label: 'Rejected by professional'} as ChartDataSets;
  private rejectedAppointmentsByPatientMonthly = {data: [], label: 'Rejected by patient'} as ChartDataSets;
  private monthlyDateSet = [] as ChartDataSets[];

  constructor(private calendarService: CalendarService, private authenticationService: AuthenticationService) {
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ] as ChartDataSets[];

  ngOnInit() {
    const year = new Date().getFullYear();
    // return {...appointment, calendarId: calendar.id, date: new Date(calendar.year, calendar.month, calendar.day)};
    this.currentEmail = this.authenticationService.getCurrentUser().email;
    this.calendarService.getCalendarsByYear(year).subscribe(value => {
        for (let i = 0; i < 12; i++) {
          const appointmentsByMonth: Appointment[] = value
            .filter(calendar => calendar.month === i)
            .flatMap(calendar => calendar.schedule).flatMap(schedule => schedule.appointments);
          console.log(appointmentsByMonth);
          this.appointmentsDoneMonthly.data.push(appointmentsByMonth
            .filter(app => app.done).length);
          this.appointmentsNotDoneMonthly.data.push(appointmentsByMonth
            .filter(app => !app.done).length);
          this.pendingAppointmentsByProfessionalMonthly.data.push(appointmentsByMonth
            .filter(app => app.acceptedByProfessional === undefined || app.acceptedByProfessional === '').length);
          this.pendingAppointmentsByPatientMonthly.data.push(appointmentsByMonth
            .filter(app => !app.acceptedByPatient === undefined || app.acceptedByPatient === '').length);
          this.acceptedAppointmentsByPatientMonthly.data.push(appointmentsByMonth
            .filter(app => app.acceptedByPatient).length);
          this.acceptedAppointmentsByProfessionalMonthly.data.push(appointmentsByMonth
            .filter(app => app.acceptedByProfessional).length);
          this.rejectedAppointmentsByPatientMonthly.data.push(appointmentsByMonth
            .filter(app => app.acceptedByPatient === false).length);
          this.rejectedAppointmentsByProfessionalMonthly.data.push(appointmentsByMonth
            .filter(app => app.acceptedByProfessional === false).length);
        }
        this.monthlyDateSet.push(this.appointmentsDoneMonthly);
        this.monthlyDateSet.push(this.appointmentsNotDoneMonthly);
        this.monthlyDateSet.push(this.pendingAppointmentsByProfessionalMonthly);
        this.monthlyDateSet.push(this.pendingAppointmentsByPatientMonthly);
        this.monthlyDateSet.push(this.acceptedAppointmentsByPatientMonthly);
        this.monthlyDateSet.push(this.acceptedAppointmentsByProfessionalMonthly);
        this.monthlyDateSet.push(this.rejectedAppointmentsByPatientMonthly);
        this.monthlyDateSet.push(this.rejectedAppointmentsByProfessionalMonthly);
        console.log(this.monthlyDateSet);
      }
    );
  }
}
