import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderData } from '../../providers/order-data/order-data';
import { ServiceData } from '../../providers/service-data/service-data';

import { DataServiceProvider } from '../../providers/data-service/data-service';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';

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

  orderItem = new OrderData();
  orderServiceID: string;

  calltype = "creating";

  sItemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  sItems: Observable<ServiceData[]>; // read collection

  oItemsCollection: AngularFirestoreCollection<OrderData>; //Firestore collection
  oItemDocument: AngularFirestoreDocument<OrderData>; // read collection


  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {


    this.oItemsCollection = this.afs.collection("orders");
    if(navParams.data != null)
    {
      this.orderItem = navParams.get("order"); 

      if(this.orderItem.oid)
      {
        this.calltype = "editing";
      }
    }  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderCreatorPage');
  }

  ionViewWillLeave() {

    if(this.orderServiceID != "")
    {
      this.sItemsCollection = this.afs.collection("services", ref => {
        return ref.where("sid","==",this.orderServiceID);
      });

      this.sItemsCollection.valueChanges().subscribe(snapshot => {
        console.log("get service: ", snapshot);
        this.orderItem.service = snapshot[0];

        this.orderItem.subtotal = this.orderItem.service.price * this.orderItem.quantity;
        console.log("subtotal: ", this.orderItem.subtotal);
        if(this.calltype == "creating" && this.orderItem.service != null && this.orderItem.orderby != "" && this.orderItem.servelocation != "")
        {
          this.oItemsCollection.add({
            "oid": "",
            "timestamp": new Date(),
            "status": "created",
            "type": this.orderItem.type,
            "service": this.orderItem.service,
            "quantity": this.orderItem.quantity,
            "subtotal": this.orderItem.subtotal,
            "servedate": this.orderItem.servedate,
            "servetime": this.orderItem.servetime,
            "servelocation": this.orderItem.servelocation,
            "note": this.orderItem.note,
            "provideby": this.orderItem.service.provider,
            "orderby": firebase.auth().currentUser.uid,
            "beneficiary": firebase.auth().currentUser.uid,
            "email": this.orderItem.email,
            "phone": this.orderItem.phone,
            //"tags": "",
            "createAt": firebase.firestore.FieldValue.serverTimestamp(),
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(docRef => {
            this.oItemsCollection.doc(docRef.id).update({
              "oid": docRef.id,
              "status": "updated",
              "updateAt": firebase.firestore.FieldValue.serverTimestamp()
            });
          })
          .catch(error => console.log(error));

        }
        
        if(this.calltype == "editing" && this.orderItem.servedate != "")
        {
          this.oItemsCollection.doc(this.orderItem.oid).update({
            "status": "updated",
            "quantity": this.orderItem.quantity,
            "servdate": this.orderItem.servedate,
            "servetime": this.orderItem.servetime,
            "servelocation": this.orderItem.servelocation,
            "email": this.orderItem.email,
            "phone": this.orderItem.phone,
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
          });
        }

      });
    }

    
    
  }

}
