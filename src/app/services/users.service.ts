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

  constructor(private store: AngularFirestore, private authentication: AuthenticationService) {
  }

  createUser(email: string, password: string, userToCreate: UserCreation): Promise<any> {
    return this.authentication.createUser(email, password, userToCreate);
    // return this.authentication.signUp(email, password)
    //   .then(() => this.store.collection('users').doc(email).set(
    //     {
    //       name: userToCreate.name,
    //       lastname: userToCreate.lastname,
    //       profile: userToCreate.lastname,
    //       specializations: userToCreate.specializations
    //     }
    //   ).then(() => Promise.all([this.angularFireStorage.ref(email + '_1.jpg').put(userToCreate.firstImage),
    //     this.angularFireStorage.ref(email + '_2.jpg').put(userToCreate.secondImage)])
    //   )).catch(console.error);
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
}
