import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

import firebase from 'firebase/app';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  constructor(
  ) {
    console.log('Hello LoginServiceProvider Provider');
  }

  isUserLogined(): Promise<boolean> {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        //console.log("firebase auth status change: ", user);
        if(user)
        {
          resolve(true);
        }
        else
        {
          resolve(false);
        }
      });
    });
  }

}
