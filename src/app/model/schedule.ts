import {Appointment} from './appointment';

export interface Schedule {
// {
//   medicId: 'calixto.y.gonzalez@gmail.com',
//   medicName: 'Calixto Gonzalez',
//   appointments: [
//     '08:00',
//     '14:00'
//   ]
// },

  medicId: string;
  medicName?: string;
  appointments: Appointment[];
}
