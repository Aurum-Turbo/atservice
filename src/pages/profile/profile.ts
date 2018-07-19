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

  userDataObj: UserData = new UserData();
  dateofBirth: Date = new Date();
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userDataObj.avatar = "assets/imgs/avatar.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  ionViewWillEnter() {
    
  }
  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    console.log(this.userDataObj);
    //this.dataService.updateServiceList("new",this.serviceObj);

  }

  onClick(item) {

  }
}
