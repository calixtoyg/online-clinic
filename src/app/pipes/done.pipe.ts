import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentStatesFilter} from '../model/appointment-states-filter';

@Pipe({
  name: 'done'
})
export class DonePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (args[0] && Array.isArray(value)) {
      const filters = args[0] as AppointmentStatesFilter[];
      if (filters) {
        const appointmentStatesFilter = filters.find(filter => filter.condition === 'done');
        if (appointmentStatesFilter) {
          if (appointmentStatesFilter.filter === 'done') {
            return value.filter(searchAndFilter => searchAndFilter.done === true);
          } else if (appointmentStatesFilter.filter === 'done') {
            return value.filter(searchAndFilter => searchAndFilter.done === false || searchAndFilter.done === undefined);
          }
        }
      }
    }
    return value;
  }

}
