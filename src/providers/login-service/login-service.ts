import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  isUserLoggedIn: boolean = false;

  constructor() {
    console.log('Hello LoginServiceProvider Provider');
    this.isUserLogined();
  }

  isUserLogined() {
      firebase.auth().onAuthStateChanged(user => {
        //console.log("firebase auth status change: ", user);
        if(user)
        {
          this.isUserLoggedIn = true;
        }
        else
        {
          this.isUserLoggedIn = false;
        }
      });
  }

}
