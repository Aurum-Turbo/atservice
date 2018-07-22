import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup} from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { UserPage } from '../user/user';


import { UserData } from '../../providers/user-data/user-data';
import { DataServiceProvider } from '../../providers/data-service/data-service';
//import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  signupForm: FormGroup;
  loginError: string;
  isSignUp: boolean = false;
  
  userType: string = "user";

  //form group
  validation_messages = {
    'password': [
        { type: 'required', message: '* Password is required' },
        { type: 'minlength', message: '* Password must be at least 6 characters long' },
        { type: 'maxlength', message: '* Password cannot be more than 8 characters long' },
        { type: 'pattern', message: '* Your password need to have both numbers and letters' }
      ],
    'email': [
        { type: 'required', message: '* Email is required' },
        { type: 'pattern', message: '* Please give a valid email address' }
      ]
    //more messages
    }

  constructor(
    private afs: AngularFirestore,
    //public dataService: DataServiceProvider,
    //private authService: AuthServiceProvider,
    private fb: FormBuilder,
    public navCtrl: NavController, public navParams: NavParams) {
      
    this.loginForm = this.fb.group({
      email: ['',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
  
      password: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])]
    });

    this.signupForm = fb.group({
      email: ['',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
  
      password: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],

      type: ['']

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    if(firebase.auth().currentUser)
    {
      this.navCtrl.setRoot(UserPage);
    }

  }

  ionViewWillLeave() {
    this.isSignUp = false;
  }

  onClick(event: String) {
    if(event == "signup")
    {
      //console.log("email: ", this.email, "password: ", this.password);
      //this.navCtrl.setRoot(TabsPage);
      this.isSignUp = true;
    }
  }

  login() {
      firebase.auth().signInWithEmailAndPassword(this.loginForm.value.email,this.loginForm.value.password)
      .then(response => {
        this.navCtrl.setRoot(UserPage);
      })
      .catch(error => {
        // handle error by showing alert
        console.log("login failed");
      });
  }

  signup() {
    firebase.auth().createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
    .then(response => {
      //create user data record
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      .set({
        uid: firebase.auth().currentUser.uid,
        type: this.userType,
        status: "created",
        avatar: "",
        nickname: "",
        gender: "",
        birthday: "",
        location: "",
        brief: "",
        rate: 5
      })
      .catch(err => {
        console.log(err);
      });
      this.navCtrl.setRoot(UserPage);
    })
    .catch(error => {
        // handle error by showing alert
        console.log(error);
    });
  }
}
