import { Pipe, PipeTransform } from '@angular/core';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'cancelledByPatient'
})
export class CancelledByPatientPipe implements PipeTransform {

  transform(value: Appointment, ...args: unknown[]): unknown {
    return !value.done && typeof value.acceptedByPatient !== 'boolean';
  }

}
