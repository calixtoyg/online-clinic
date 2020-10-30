import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthenticationService} from '../../services/authentication.service';
import {finalize, map, mapTo, mergeAll, mergeMap, switchMap, tap} from 'rxjs/operators';
import {combineLatest, forkJoin, from, merge, Observable, of, pipe} from 'rxjs';

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
      this.users = firestore.collection('users').valueChanges({idField: 'uuid'}).pipe(map(users => {
        return this.mapUrlToUser(users);
      })).pipe(mergeMap(this.toUsers));
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
    let observables = users.map((user) => {
        return combineLatest([this.storage.ref(user.uuid + `_${1}.jpg`).getDownloadURL(), this.storage.ref(user.uuid + `_${2}.jpg`).getDownloadURL()])
          .pipe(map(value => {
            console.log('tapping', value);
            return {firstImage: value[0], secondImage: value[1], ...user};
          }));

      }
    );
    return observables;

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

  ngOnInit(): void {
  }
}
