import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  public cardList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
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
 
}
