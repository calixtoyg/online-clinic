import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentStatesFilter} from '../model/appointment-states-filter';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'medicAccepted'
})
export class MedicAcceptedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    if (args[0] && Array.isArray(value)) {
      const filters = args[0] as AppointmentStatesFilter[];
      if (filters) {
        const appointmentStatesFilter = filters.find(filter => filter.condition === 'acceptedByProfessional');
        if (appointmentStatesFilter) {
          if (appointmentStatesFilter.filter === 'acceptedByProfessional') {
            // @ts-ignore
            return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === true);
          } else if (appointmentStatesFilter.filter === 'notAcceptedByProfessional') {
            // @ts-ignore
            return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === false);
          } else if (!appointmentStatesFilter.filter) {
            return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === '' || searchAndFilter.acceptedByProfessional === undefined );
          }
        }
      }
    }
    return value;
    // @ts-ignore
    // const arg: {search: string | boolean, filter: string} = args[0];
    // if (arg && arg.filter && arg.filter === 'acceptedByProfessional') {
    //   if (arg.search === true) {
    //     // @ts-ignore
    //     return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === true);
    //   } else if (arg.search === false) {
    //     // @ts-ignore
    //     return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === false);
    //   } else if (!arg.search) {
    //     return value.filter(searchAndFilter => searchAndFilter.acceptedByProfessional === '' || searchAndFilter.acceptedByProfessional === undefined);
    //   }
    //
    // }
    return value;
  }

}
