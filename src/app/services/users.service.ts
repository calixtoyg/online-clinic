import {Injectable} from '@angular/core';
import {UserCreation} from '../model/user-creation';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private store: AngularFirestore) {
  }

  createUser(email: string, userToCreate: UserCreation): Promise<void> {
    return this.store.collection('users').doc(email).set({...userToCreate});
  }
}
