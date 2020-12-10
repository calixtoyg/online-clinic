import { Pipe, PipeTransform } from '@angular/core';
import {AppointmentStatesFilter} from '../model/appointment-states-filter';

@Pipe({
  name: 'email'
})
export class EmailPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): unknown {
    // @ts-ignore
    // return value.filter(searchAndFilter => searchAndFilter.email.startsWith(arg.search));

    if (args[0] && Array.isArray(value)) {
      const filters = args[0] as AppointmentStatesFilter[];
      if (filters) {
        const appointmentStatesFilter = filters.find(filter => filter.condition === 'email');
        if (appointmentStatesFilter) {
          return value.filter(searchAndFilter => searchAndFilter.email.startsWith(appointmentStatesFilter.search));
        }
      }
    }
    return value;
  }

}
