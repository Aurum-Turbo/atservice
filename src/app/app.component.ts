import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { TabsPage } from '../pages/tabs/tabs';

import { DataServiceProvider } from '../providers/data-service/data-service';
import { GeoServiceProvider } from '../providers/geo-service/geo-service';

import { AppSettings } from '../providers/app-setting';
import firebase from 'firebase/app';
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

    //this.dataService.loadCurUserData();
    /*
    this.geoService.geoCurLocation().then(results => {
      this.geoService.posToAddr(results).then(address => {
        console.log("address: ", address);
      })
      .catch(err => {console.log(err);});
    })
    .catch(err => {console.log(err);});
    */
    //firebase.initializeApp(AppSettings.FIREBASE_CONFIG);

    this.geoService.load().then(resp => {
      console.log("google maps v3 API loaded");
    })
    .catch(err => {console.log(err);});
  }
}

