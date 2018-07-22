import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data/user-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';

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

  userDocument: AngularFirestoreDocument<UserData>;
  currentUser: Observable<UserData>; 
  
  constructor(
    private afs: AngularFirestore,
    public navCtrl: NavController, public navParams: NavParams) {
    //this.userDataObj.avatar = "assets/imgs/avatar.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    /*
    firebase.firestore().collection("users").where("uid","==",firebase.auth().currentUser.uid).get()
    .then(snapshot => {snapshot.forEach(change => {
      this.userDataObj = change.data() as UserData;
      });
      console.log("data: ", this.userDataObj);
    })
    .catch(error => {
      console.log(error);
    });
    
    if(this.userDataObj.avatar == null)
    {
      this.userDataObj.avatar = "assets/imgs/avatar.png";
    }
    */
   this.userDocument = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid);
   this.userDocument.valueChanges().subscribe(value => {
     if(value)
     {
       this.userDataObj = value;
     }
   });
  }
  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    /*firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
    .set({
      uid: firebase.auth().currentUser.uid,
      status: "updated",
      avatar: this.userDataObj.avatar,
      nickname: this.userDataObj.nickname,
      gender: this.userDataObj.gender,
      birthday: this.userDataObj.birthday,
      location: this.userDataObj.location,
      brief: this.userDataObj.brief
    })
    .catch(error => {
      console.log("data update failed: ", error);
    });*/


    console.log(this.userDataObj);
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
