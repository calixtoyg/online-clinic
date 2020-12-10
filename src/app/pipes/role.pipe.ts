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
        link: 'welcome/professional',
        subMenu: [],
        role: [Role.PROFESSIONAL, Role.MEDIC]
      },
      {
        menu: 'Welcome',
        link: 'welcome/patient',
        subMenu: [],
        role: [Role.PATIENT]
      },
      {
        menu: 'Turnos',
        link: 'appointments',
        subMenu: [],
        role: [Role.PROFESSIONAL, Role.MEDIC]
      }
    ].filter((menu) => menu.role.includes(localStorage.getItem('role') as Role));
  }

}
