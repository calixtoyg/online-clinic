import {Appointment} from './appointment';

export interface AppointmentDTO {
  appointment: Appointment;
  calendarId: string;
  date: Date;
}
