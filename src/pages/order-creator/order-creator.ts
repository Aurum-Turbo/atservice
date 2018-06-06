import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderData } from '../../providers/order-data/order-data';
import { DataServiceProvider } from '../../providers/data-service/data-service';

/**
 * Generated class for the OrderCreatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-creator',
  templateUrl: 'order-creator.html',
})
export class OrderCreatorPage {

  orderObj = new OrderData();
  orderServiceID: string;

  constructor(
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderCreatorPage');
  }

  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    console.log(this.orderObj);
    this.orderObj.service = this.dataService.getServiceByID(this.orderServiceID);
    if(this.orderObj.service)
    {
      this.dataService.updateOrderList("save",this.orderObj);
    }
  }

}
