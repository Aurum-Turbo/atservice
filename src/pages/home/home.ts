import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServiceDetailsPage } from '../service-details/service-details';
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

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: Observable<PostData[]>; // read collection

  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    //this.serviceList = this.dataService.serviceList;
    //console.log("load servicelist: ", this.serviceList);
    //this.data = this.dataService.readList("service");
    this.itemsCollection = this.afs.collection("posts", ref => {return ref.orderBy("updateAt",'desc')});
    this.items = this.itemsCollection.valueChanges();
  }

  onClick(event: string) {
    if(event == "detail")
    {
      this.navCtrl.push(ServiceDetailsPage);
    }
  }
}
