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
<<<<<<< HEAD

  userDataObj: UserData = new UserData();
=======
  userDataObj:UserData = new UserData();
>>>>>>> 56cc9b5230e984d6552fd5e541a76e9dc35fad09
  dateofBirth: Date = new Date();
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userDataObj.avatar = "assets/imgs/avatar.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
<<<<<<< HEAD
  ionViewWillEnter() {
    
  }
  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    console.log(this.userDataObj);
    //this.dataService.updateServiceList("new",this.serviceObj);

=======
  
  onSelect(event) {
    let reader = new FileReader();
    console.log("userDataObj: ", this.userDataObj, "result: ", event.target.result);
    reader.onload = (event: any) => {
      
      this.userDataObj.avatar = event.target.result;
      
    }
    reader.readAsDataURL(event.target.files[0]);
>>>>>>> 56cc9b5230e984d6552fd5e541a76e9dc35fad09
  }

  onClick(item) {

  }
}
