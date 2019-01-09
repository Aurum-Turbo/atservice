import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderCreatorPage } from '../order-creator/order-creator';
import { JobData } from '../../providers/job-data/job-data';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  orderList = [];

  constructor(
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  ionViewWillEnter(){
    //this.orderList = this.dataService.orderList;
    console.log("load orderlist: ", this.orderList);
    //this.data = this.dataService.readList("service");
  }

  onClick(event: string, item: any) {
    if(event == "new")
    {
      this.navCtrl.push(OrderCreatorPage);

    }

    if(event == "discard")
    {
      //this.dataService.updateOrderList("discard",item);
    }

    if(event == "decline")
    {
      //send decline message to server
      //delete local copy
      //this.dataService.updateOrderList("discard",item);
    }

    if(event == "accept")
    {
      var jobObj = new JobData();
      jobObj.order = item;
      //this.dataService.updateJobList("new",jobObj);
      //this.dataService.updateOrderList("discard", item);
    }
  }

}
