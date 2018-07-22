import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceData } from '../../providers/service-data/service-data';

import { DataServiceProvider } from '../../providers/data-service/data-service';
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

  serviceList = [];
  cardList: any = [];
  date = new Date();
  constructor(
    public dataService: DataServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) { 
    // 首页卡片图片循环。
    for(let i = 0; i < 10; i++){
    this.cardList.push({
      pic: 'assets/imgs/0'+i+'.jpeg'
    })
  }
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    this.serviceList = this.dataService.serviceList;
    console.log("load servicelist: ", this.serviceList);
    //this.data = this.dataService.readList("service");
  }
}
