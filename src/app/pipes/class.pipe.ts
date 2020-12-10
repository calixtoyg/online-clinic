import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentDTO} from '../model/appointment-dto';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'class'
})
export class ClassPipe implements PipeTransform {

  transform(appointment: Appointment, ...args: unknown[]): unknown {
    if (args[0] === 'acceptedByPatient') {
      if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
        return 'black';
      } else if (appointment.acceptedByPatient === false) {
        return 'cancelled';
      } else if (appointment.acceptedByPatient === true) {
        return 'green-icon';
      }
    }
    if (args[0] === 'acceptedByProfessional') {
      if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
        return 'black';
      } else if (appointment.acceptedByProfessional === false) {
        return 'cancelled';
      } else if (appointment.acceptedByProfessional === true) {
        return 'green-icon';
      }
    }
    if (args[0] === 'done') {
      if (appointment.done === true) {
        return 'green-icon';
      } else if (!appointment.done || appointment.done === false) {
        return 'black';
      }
    }
  }

}
