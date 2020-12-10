import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentDTO} from '../model/appointment-dto';
import {AppointmentFilterTypes} from '../enum/appointment-filter-types.enum';

@Pipe({
  name: 'filterPatients'
})
export class FilterPatientsPipe implements PipeTransform {

  transform(value: AppointmentDTO[], ...args: any[]): AppointmentDTO[] {
    if (args[0]) {
      if (AppointmentFilterTypes[args[0].filter] === AppointmentFilterTypes.TODAY) {
        const today = new Date();
        return value.filter(app =>
          today.getFullYear() === app.date.getFullYear()
          && today.getMonth() === app.date.getMonth()
          && today.getDate() === app.date.getDate()
        );
      }
      const date = args[0].date;
      if (date) {
        return value.filter(app =>
          date.getFullYear() === app.date.getFullYear()
          && date.getMonth() === app.date.getMonth()
          && date.getDate() === app.date.getDate()
        );
      }
    }
    return value;

  }

}
