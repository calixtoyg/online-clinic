import {Injectable} from '@angular/core';
import {UserCreation} from '../model/user-creation';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthenticationService} from './authentication.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Profile} from '../enum/profile.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private store: AngularFirestore) {
  }

  getUserWithProfile(profile: Profile): Observable<UserCreation[]> {
    return this.store.collection<UserCreation>('users').snapshotChanges().pipe(
      map(dataArray => dataArray.map(each => {
        const data = each.payload.doc.data() as UserCreation;
        data.email = each.payload.doc.id;
        return data;
      }))
    ).pipe(map(arrayOfUsers => {
        return arrayOfUsers.filter(user => user.profile.toLowerCase() === profile);
      })
    );
  }

  getUserByMail(email: string): Observable<UserCreation> {
    return this.store.doc<UserCreation>('users/' + email).snapshotChanges().pipe(
      map(user => {
        console.log(user);
        const data = user.payload.data() as UserCreation;
        data.email = user.payload.id;
        return data;
      })
    );
  }
}
