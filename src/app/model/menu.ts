import {Role} from '../enum/role.enum';

export interface Menu {
  menu: string;
  role: Role[];
  link: string;
  subMenu: string[];
}
