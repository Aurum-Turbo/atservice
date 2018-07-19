import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data/user-data';

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
  userDataObj:UserData = new UserData();
  dateofBirth: Date = new Date();
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userDataObj.avatar = "assets/imgs/avatar.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  
  onSelect(event) {
    let reader = new FileReader();
    console.log("userDataObj: ", this.userDataObj, "result: ", event.target.result);
    reader.onload = (event: any) => {
      
      this.userDataObj.avatar = event.target.result;
      
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  onClick(item) {

  }
}
