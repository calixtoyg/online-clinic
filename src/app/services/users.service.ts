import {Injectable} from '@angular/core';
import {UserCreation} from '../model/user-creation';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthenticationService} from './authentication.service';

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
}
