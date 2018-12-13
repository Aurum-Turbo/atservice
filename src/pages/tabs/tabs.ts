import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage} from '../home/home';
import { LoginPage } from '../login/login';
import { UserPage } from '../user/user';
import { MessagePage } from '../message/message';
import { ServiceDetailsPage } from '../service-details/service-details';

import firebase from 'firebase/app';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = MessagePage;
  tab3Root: any = UserPage;
  mySelectedIndex: number;

  constructor(

    public localStorage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
