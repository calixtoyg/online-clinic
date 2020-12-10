import {Directive, Input, Output, EventEmitter} from '@angular/core';
import {AppointmentDTO} from '../model/appointment-dto';
export type SortablePatientAppointment = keyof AppointmentDTO | '';
export type SortDirection = 'asc' | 'desc' | '';
export interface SortEvent {
  column: SortablePatientAppointment;
  direction: SortDirection;
}
const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };

@Directive({
  selector: '[appSortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class SortableDirective {
  @Input() sortable: SortablePatientAppointment = '';
  @Input() direction: SortDirection;
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }

}
