import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';

/**
 * Generated class for the ServiceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {
  date: Date = new Date();
  serviceObj = new ServiceData();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.data != null)
    {
      this.serviceObj = navParams.data;
    }

    console.log("get navParams: ", navParams.data);
    console.log("Date: ", this.date);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceDetailsPage');
  }

}
