import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the JobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-job',
  templateUrl: 'job.html',
})
export class JobPage {

  jobList = [];

  constructor(
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobPage');
  }

  ionViewWillEnter(){
    //this.jobList = this.dataService.jobList;
    console.log("load joblist: ", this.jobList);
    //this.data = this.dataService.readList("service");
  }

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }

  onClick(event: string, item: any) {
    item.status = event;
    //this.dataService.updateJobList(event,item);
  }
}
