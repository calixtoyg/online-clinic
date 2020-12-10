import {Pipe, PipeTransform} from '@angular/core';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(appointment: Appointment, ...args: unknown[]): unknown {
    if (args[0] === 'acceptedByProfessional') {
      if (appointment.acceptedByProfessional === undefined || appointment.acceptedByProfessional === '') {
        return 'pending_action';
      } else if (appointment.acceptedByProfessional === false) {
        return 'clear';
      } else if (appointment.acceptedByProfessional === true && appointment.acceptedByPatient === true) {
        return 'done_all';
      } else if (appointment.acceptedByProfessional === true) {
        return 'check';
      }
    }

    if (args[0] === 'acceptedByPatient') {
      if (appointment.acceptedByPatient === undefined || appointment.acceptedByPatient === '') {
        return 'pending_action';
      } else if (appointment.acceptedByPatient === false) {
        return 'clear';
      } else if (appointment.acceptedByProfessional === true && appointment.acceptedByPatient === true) {
        return 'done_all';
      } else if (appointment.acceptedByPatient === true) {
        return 'check';
      }
    }

    if (args[0] === 'done') {
      if (appointment.done === true) {
        return 'done';
      } else if (!appointment.done || appointment.done === false) {
        return 'pending';
      }
    }
  }

}
