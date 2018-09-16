import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';
import { PostData } from '../../providers/post-data/post-data';
import { MessageData } from '../../providers/message-data/message-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { OrderCreatorPage } from '../order-creator/order-creator';
import { OrderData } from '../../providers/order-data/order-data';

/**
 * Generated class for the ServiceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {
  @ViewChild('slider') slider: Slides;
  date: Date = new Date();
  postObj: PostData;
  message = new MessageData();

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection

  sItemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  sItems: Observable<ServiceData[]>;

  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.data != null)
    {
      this.postObj = navParams.get("post");
      console.log("get navParams: ", this.navParams.data);
    }

    this.itemsCollection = this.afs.collection("messages");

    console.log("get post: ", this.postObj);
    console.log("Date: ", this.date);
  }
  ngAfterViewInit() {
    this.slider.autoHeight = true;
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceDetailsPage');
    
  }

  ionViewWillEnter() {

    this.dataService.loadCurUserData();
    this.sItemsCollection = this.afs.collection("services", ref => {
      return ref.where("provider", "==", this.postObj.author);
    });

    this.sItems = this.sItemsCollection.valueChanges();
  }

  onClick(event: string, item: any) {

    //console.log("message: ", this.message.message);
    if(event == "chat")
    {
      if(this.message.message)
      {
        this.message.receiver = this.postObj.author;
        this.message.sender = firebase.auth().currentUser.uid;
        this.message.time = new Date();

        this.itemsCollection.doc(this.message.receiver)
        .collection('chat').add({
          "mid": "",
          "time": this.message.time,
          "sender": this.message.sender,
          "snickname": this.dataService.userDataObj.nickname,
          "savatar": this.dataService.userDataObj.avatar,
          "receiver": this.message.receiver,
          "message": this.message.message,
          "status": "new",
          "sendAt": firebase.firestore.FieldValue.serverTimestamp()
        }).then(docRef => {
          this.itemsCollection.doc(this.message.receiver)
          .collection('chat').doc(docRef.id).update({
            "mid": docRef.id,
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .catch(error => console.log(error));
      }
    }

    if(event == "service" && item)
    {
      var newOrder = new OrderData();
      newOrder.service = item as ServiceData;
      newOrder.orderby = firebase.auth().currentUser.uid;
      this.navCtrl.push(OrderCreatorPage,{"order": newOrder});
    }
  }

}
