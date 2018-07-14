import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage} from '../home/home';
import { UserPage } from '../user/user';
import { ServicePage } from '../service/service';
import { OrderPage } from '../order/order';
import { MessagePage } from '../message/message';
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
  // tab4Root: any = MessagePage;
  mySelectedIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
