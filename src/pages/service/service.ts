import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
import { ServiceData } from '../../providers/service-data/service-data';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ServiceDetailsPage } from '../service-details/service-details';

/**
 * Generated class for the ServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {

  serviceList = [];

  constructor(
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicePage');
  }

  ionViewWillEnter(){
    //this.serviceList = this.dataService.serviceList;
    console.log("load servicelist: ", this.serviceList);
    //this.data = this.dataService.readList("service");
  }

  onClick(event: string, item: ServiceData) {
    if(event == "new")
    {
      this.navCtrl.push(EditorPage);
    }

    if(event == "discard")
    {
      //this.dataService.updateServiceList(event,item);
    }

    if(event == "edit")
    {
      this.navCtrl.push(EditorPage, item);
    }

    if(event == "submit")
    {
      //this.navCtrl.push(EditorPage, item);
      item.status = "activated";
      //this.dataService.updateServiceList('update',item);
    }

    if(event == "suspend")
    {
      //this.navCtrl.push(EditorPage, item);
      item.status = "suspended";
      //this.dataService.updateServiceList('update',item);
    }

    if(event == "resume")
    {
      //this.navCtrl.push(EditorPage, item);
      item.status = "activated";
      //this.dataService.updateServiceList('update',item);
    }

    if(event == "details")
    {
      this.navCtrl.push(ServiceDetailsPage, item);
    }
  }

}
