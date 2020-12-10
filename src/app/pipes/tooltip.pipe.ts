import {Pipe, PipeTransform} from '@angular/core';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'tooltip'
})
export class TooltipPipe implements PipeTransform {

  transform(value: Appointment, ...args: unknown[]): unknown {

    if (args[0] === 'acceptedByPatient') {
      if (value.acceptedByPatient === undefined || value.acceptedByPatient === '') {
        return 'Appoint is pending acceptance';
      } else if (value.acceptedByPatient === false) {
        return 'Appointment has been rejected by the patient';
      } else if (value.acceptedByPatient === true) {
        return 'Appointment has been accepted by the patient';
      }
    }
    if (args[0] === 'acceptedByProfessional') {
      if (value.acceptedByProfessional === undefined || value.acceptedByProfessional === '') {
        return 'Appoint is pending acceptance';
      } else if (value.acceptedByProfessional === false) {
        return 'Appointment has been rejected by the medic';
      } else if (value.acceptedByProfessional === true) {
        return 'Appointment has been accepted by the medic';
      }
    }

    if (args[0] === 'done') {
      if (value.done === true) {
        return 'Appoint has been completed';
      } else if (!value.done || value.done === false) {
        return 'Appointment has been completed';
      }
    }
  }

}
