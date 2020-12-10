import { Pipe, PipeTransform } from '@angular/core';
import {AppointmentStatesFilter} from '../model/appointment-states-filter';
import {Appointment} from '../model/appointment';

@Pipe({
  name: 'patientAccepted'
})
export class PatientAcceptedPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    // @ts-ignore
    if (args[0] && Array.isArray(value)) {
      const filters = args[0] as AppointmentStatesFilter[];
      if (filters) {
        const appointmentStatesFilter = filters.find(filter => filter.condition === 'acceptedByPatient');
        if (appointmentStatesFilter) {
          if (appointmentStatesFilter.filter === 'acceptedByPatient') {
            return value.filter(searchAndFilter => searchAndFilter.acceptedByPatient === true);
          } else if (appointmentStatesFilter.filter === 'notAcceptedByPatient') {
            return value.filter(searchAndFilter => searchAndFilter.acceptedByPatient === false);
          } else if (!appointmentStatesFilter.filter) {
            return value.filter(searchAndFilter =>  searchAndFilter.acceptedByPatient === '' || searchAndFilter.acceptedByPatient === undefined);
          }
        }
      }
    }
    return value;
  }

}
