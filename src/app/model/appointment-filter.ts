import {AppointmentFilterTypes} from '../enum/appointment-filter-types.enum';

export interface AppointmentFilter {
  filter: AppointmentFilterTypes;
  date?: Date;
}
