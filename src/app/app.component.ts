import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { TabsPage } from '../pages/tabs/tabs';
@Component({  
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    public localStorage: Storage,
    public dataService: DataServiceProvider,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    localStorage.ready().then(() => {

      this.rootPage = TabsPage;
      /*
      this.localStorage.get("loginstatus").then(status => {
        this.rootPage = status? TabsPage : LoginPage;
        if (this.rootPage == TabsPage)
        {
          this.dataService.load();
        }

      });*/
      //console.log("login status: ", this.dataService.isLogin());
      //this.rootPage = this.dataService.isLogin()? TabsPage:LoginPage; 
    });
  }
}

