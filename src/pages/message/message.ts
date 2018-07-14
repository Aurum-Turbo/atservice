import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  public msgList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    for(let i=0; i<10; i++ ){
      
      this.msgList.push(i)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

}
