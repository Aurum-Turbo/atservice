import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(
    public afAuth: AngularFireAuth,
    public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  register(credentials): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  login(credentials): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  loginAsGuest(): Promise<any> {
    return this.afAuth.auth.signInAnonymously();
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

}
