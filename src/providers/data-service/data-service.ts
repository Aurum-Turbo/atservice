import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { UserData } from '../user-data/user-data';



/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DataServiceProvider {

  userDataObj = new UserData();

  constructor(
    private afs: AngularFirestore) {
    console.log('Hello DataServiceProvider Provider');
  }

  loadCurUserData(): Observable<UserData> {
    this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid).valueChanges().subscribe(snapshot => {
      this.userDataObj = snapshot;
    });

    //console.log("load current user data: ", this.userDataObj);
    return new Observable<UserData>(observer => {
                observer.next(this.userDataObj);
                observer.complete();
              });
  
  }
}
