import { Pipe, PipeTransform } from '@angular/core';
import {AppointmentStatesFilter} from '../model/appointment-states-filter';

@Pipe({
  name: 'dynamic'
})
export class DynamicPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (args[0] && Array.isArray(value)) {
      const filters = args[0] as AppointmentStatesFilter[];
      if (filters) {
        const appointmentStatesFilter = filters.find(filter => filter.condition === 'dynamic');
        if (appointmentStatesFilter && appointmentStatesFilter.filter) {
          return value.filter(eachObject => {
            if (eachObject && eachObject.review && eachObject.review.additionalInfo) {
              let filterKeys = Object.keys(eachObject.review.additionalInfo);
              return filterKeys.filter(object => object.startsWith(appointmentStatesFilter.filter)).length > 0;
            }
            return false;
          });
        }
      }
    }

    return value;
  }

}
