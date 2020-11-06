import {Pipe, PipeTransform} from '@angular/core';
import {Profile} from '../enum/profile.enum';

@Pipe({
  name: 'patients'
})
export class PatientsPipe implements PipeTransform {

  transform(users): unknown {
    if (users) {
      return users.filter(user => user.profile === Profile.PATIENT);
    } else {
      return [];
    }
  }

}
