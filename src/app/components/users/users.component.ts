import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthenticationService} from '../../services/authentication.service';
import {map, mergeMap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Observable<any>;
  imageSrc: string;
  images: [];


  constructor(public firestore: AngularFirestore, public storage: AngularFireStorage, public authentication: AuthenticationService) {
    this.users = firestore.collection('users').valueChanges({idField: 'uuid'});


    if (this.authentication.isLoggedIn()) {
      this.users = firestore.collection('users').valueChanges({idField: 'uuid'}).pipe(
        map(users => {
          return this.mapUrlToUser(users);
        }),
        mergeMap(this.toUsers)
      );
    }
  }

  toUsers(users) {
    return combineLatest(users);
  }

  mapUrlToUser(users) {
    const promises = [];
    const imagesUrl = [];
    // return users.map((user) => {
    //   return merge(this.storage.ref(user.uuid + `_${1}.jpg`).getDownloadURL(),
    //     this.storage.ref(user.uuid + `_${2}.jpg`).getDownloadURL(),
    //     of(user));
    // });
    // check this
    return users.map((user) => combineLatest(
      [this.getDownloadURL(user, 1), this.getDownloadURL(user, 2)]
    )
      .pipe(
        map(value => {
          return {firstImage: value[0], secondImage: value[1], ...user};
        })));

    // promises.push(.toPromise());
    // promises.push(this.storage.ref(user.uuid + `_${2}.jpg`).getDownloadURL().toPromise());
    // let userToReturn = {};
    // await Promise.all(promises).then(urls => {
    //   userToReturn = {firstImage: urls[0], secondImage: urls[1], user};
    // }).catch(value => {
    //   console.error(value);
    //   userToReturn = user;
    // });
    // return userToReturn;
  }

  private getDownloadURL(user, numberOfPicture) {
    if (user.profile.toLowerCase() === 'patient') {
      return this.storage.ref(user.uuid + `_${numberOfPicture}.jpg`).getDownloadURL();
    } else {
      return of({});
    }
  }

  ngOnInit(): void {
  }
}
