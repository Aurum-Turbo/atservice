import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup} from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { UserPage } from '../user/user';
import { HomePage } from '../home/home';


import { UserData } from '../../providers/user-data/user-data';
//import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ServiceDetailsPage } from '../service-details/service-details';
import { AlternativeServiceOptions } from 'http2';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';


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

  previousPage: any;

  //itemsCollection: AngularFirestoreCollection<UserData>; //Firestore collection

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
    private fb: FormBuilder,
    public loginService: LoginServiceProvider,
    private alertService: AlertServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

    //this.itemsCollection = this.afs.collection("users");
      
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

    this.previousPage = this.navParams.get("from");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    //console.log("page name: ", this.navCtrl.getActive().name);
    this.loginService.isUserLogined().then(result => {
      if(result)
      {
        //console.log("enter LoginPage: ", this.previousPage);
        this.navCtrl.setRoot(this.previousPage);
      }
    })
    .catch(err => {console.log(err);});
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
        //console.log("previousPage: ", this.previousPage);
        if(response)
        {
          if(this.previousPage)
          {
            if(this.previousPage == ServiceDetailsPage)
            {
              this.navCtrl.pop();
            }
            else
            {
              this.navCtrl.setRoot(this.previousPage, this.navParams);
            }
            
          }
          else
          {
            //this.navCtrl.setRoot(HomePage);
          }
          
        }
        //this.navCtrl.setRoot(UserPage);
        //this.dataService.loadCurUserData();
        /* this.afs.collection('users').doc<UserData>(firebase.auth().currentUser.uid).valueChanges().subscribe(
          userInfo => {this.navCtrl.setRoot(this.navParams.get("from"));}
        );
         */
      })
      .catch(error => {
        // handle error by showing alert
        this.alertService.presentToast(error);
        //console.log("login failed");
      });
  }

  signup() {
    firebase.auth().createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
    .then(response => {
      //create user data record
      /*
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
        rate: 5,
        star: this.user

      })
      .catch(err => {
        console.log(err);
      });*/
      var userObj = new UserData();
      userObj.setRate();
      this.afs.collection('users').doc(firebase.auth().currentUser.uid).set({
        uid: firebase.auth().currentUser.uid,
        type: this.userType,
        status: "created",
        avatar: "assets/imgs/avatar.png",
        nickname: "nickname",
        gender: "",
        birthday: "",
        location: "",
        brief: "",
        rate: 5,
        star: ["","icon-star","icon-star","icon-star","icon-star","icon-star"]

      });
      this.navCtrl.setRoot(UserPage);
    })
    .catch(error => {
        // handle error by showing alert
        console.log(error);
    });
  }

  
}
