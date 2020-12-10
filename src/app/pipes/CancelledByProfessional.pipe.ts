import { Pipe, PipeTransform } from '@angular/core';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'cancelledByProfessional'
})
export class CancelledByProfessionalPipe implements PipeTransform {

  transform(value: Appointment, ...args: unknown[]): unknown {
    console.log("entro mas veces de las q debia");
    return !value.done && typeof value.acceptedByProfessional !== 'boolean';
  }

}
