import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';

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
  //for posts
  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: Observable<PostData[]>; // read collection

  iconlike: string = "icon-heart-outline";
  constructor(
    private afs: AngularFirestore,
    //public dataService: DataServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    this.itemsCollection = this.afs.collection("posts", ref => {return ref.orderBy("updateAt",'desc')});
    this.items = this.itemsCollection.valueChanges();
  }

  onClick(event: string, object: any) {
    if(event == "detail")
    {
      this.navCtrl.push(ServiceDetailsPage);
    }

    if(event == "like")
    {
      if(this.iconlike == "icon-heart-outline")
      {
        this.itemsCollection.doc((<PostData>object).pid).update({
          "like": (<PostData>object).like + 1
        });
        this.iconlike = "icon-heart";
      }
    }
  }
}
