import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data/user-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { GeoServiceProvider } from '../../providers/geo-service/geo-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userDataObj: UserData = new UserData();
  dateofBirth: Date = new Date();
  isGender: Boolean = true;
  address: string[];
  selectedAddr: string = "";

  usersCollection: AngularFirestoreCollection<UserData>; //Firestore collection
  users: Observable<UserData[]>;

  genders: string[] = ['Male','Female','Dont wanna share'];
  constructor(
    private afs: AngularFirestore,
    public navCtrl: NavController, public navParams: NavParams) {
    //this.userDataObj.avatar = "assets/imgs/avatar.png";
    this.userDataObj.gender = "Female";

    this.usersCollection = this.afs.collection('users');

    this.address = this.navParams.get('address');
    if(this.address)
    {
      this.selectedAddr = this.address[0];
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    
   this.usersCollection.doc<UserData>(firebase.auth().currentUser.uid).valueChanges().subscribe(value => {
     if(value)
     {
       this.userDataObj = value;
       console.log("user profile loaded: ", this.userDataObj);
     }
     else
     {
       console.log("no profile in the database");
       //this.userDataObj.setRate();
        this.usersCollection.doc(firebase.auth().currentUser.uid).set({
        uid: firebase.auth().currentUser.uid,
        type: this.userDataObj.type,
        status: "created",
        avatar: "assets/imgs/avatar.png",
        nickname: "nickname",
        gender: "Female",
        birthday: "",
        location: "",
        brief: "",
        rate: 5,
        //star: ["","icon-star","icon-star","icon-star","icon-star","icon-star"]
      })
      .catch(error => {
        // handle error by showing alert
        console.log(error);
      });
      //this.navCtrl.setRoot(UserPage);
    }
   });
  }

  ionViewWillLeave() {
    //create service
    console.log("profile: ", this.userDataObj);
    this.usersCollection.doc(firebase.auth().currentUser.uid).update(this.userDataObj);

    //console.log(this.userDataObj);
    //this.dataService.updateServiceList("new",this.serviceObj);
  }

  onSelect(event) {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.userDataObj.avatar = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  onClick(item) {
    if( item == "gender")
    {
      if (this.isGender == true)
        this.isGender = false;
      else
        this.isGender = true;
    }

  }
}
