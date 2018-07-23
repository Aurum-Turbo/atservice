import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage} from '../home/home';
import { LoginPage } from '../login/login';
import { UserPage } from '../user/user';
import { MessagePage } from '../message/message';
import { ServiceDetailsPage } from '../service-details/service-details';
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
  tab3Root: any = LoginPage;
  // tab4Root: any = MessagePage;
  mySelectedIndex: number;

  constructor(

    public localStorage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    
    //this.tab3Root = LoginPage;
    /*
    localStorage.ready().then(() => {
      this.localStorage.get("loginstatus").then(status => {
        this.tab3Root = status? UserPage : LoginPage;
        //this.tab3Root = LoginPage;
        //console.log("loginstatus: ", status, "tab3Root: ", this.tab3Root);
      });
      //console.log("login status: ", this.dataService.isLogin());
      //this.rootPage = this.dataService.isLogin()? TabsPage:LoginPage; 
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
