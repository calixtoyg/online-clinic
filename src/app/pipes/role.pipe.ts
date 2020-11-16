import {Pipe, PipeTransform} from '@angular/core';
import {Menu} from '../model/menu';
import {Role} from '../enum/role.enum';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value: Menu[], ...args: unknown[]): Menu[] {
    return [
      {
        menu: 'Welcome',
        link: 'welcome',
        subMenu: [],
        role: [Role.PATIENT, Role.PROFESSIONAL, Role.ADMIN]
      },
      {
        menu: 'Turnos',
        link: 'appointments',
        subMenu: [],
        role: [Role.PROFESSIONAL]
      }
    ];
  }

}
