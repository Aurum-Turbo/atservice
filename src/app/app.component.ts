import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { TabsPage } from '../pages/tabs/tabs';

import { DataServiceProvider } from '../providers/data-service/data-service';
import { GeoServiceProvider } from '../providers/geo-service/geo-service';

@Component({  
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    public geoService: GeoServiceProvider,
    public dataService: DataServiceProvider,
    public localStorage: Storage,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    localStorage.ready().then(() => {
      this.rootPage = TabsPage;
    });

    this.geoService.geoInit();

  }
}

