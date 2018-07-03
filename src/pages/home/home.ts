import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Button } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public pdtlist=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for(let i=0; i<10; i++){
      this.pdtlist.push({
        pic:'assets/imgs/0'+i+'.jpeg',
        title:'title'+i,
        
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
