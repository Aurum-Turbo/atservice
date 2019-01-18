import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderData } from '../../providers/order-data/order-data';
import { ServiceData } from '../../providers/service-data/service-data';
import { UserData } from '../../providers/user-data/user-data';
import { AlertData } from '../../providers/alert-data/alert-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

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

  usersCollection: AngularFirestoreCollection<UserData>; //Firestore collection
  alertsCollection: AngularFirestoreCollection<AlertData>; //Firestore collection

  types: string[] = ['Escort','Transport', 'House clean'];
  servYear: Date = new Date();
  sYearrange: any[] = [this.servYear.getFullYear(), this.servYear.getFullYear()+1];
  servSchedule: Date;



  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public chatService: ChatServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.oItemsCollection = this.afs.collection("orders");
    if(navParams.data != null)
    {
      this.orderItem = navParams.get("order"); 

      if(this.orderItem.oid)
      {
        this.calltype = "editing";
      }

      this.usersCollection = this.afs.collection("users");
      this.usersCollection.doc<UserData>(firebase.auth().currentUser.uid).valueChanges().subscribe(profile => {
        this.orderItem.servelocation = profile.location;
        this.orderItem.email = firebase.auth().currentUser.email;
      });

      this.alertsCollection = this.afs.collection("alerts");

    }  
    this.orderItem.type = "Escort";
  }

  ionViewDidLoad() {
    console.log(this.servYear);
    console.log('ionViewDidLoad OrderCreatorPage');
  }

  ionViewWillLeave() {
  }
    

  onClick(event: string)
  {
    if(event == "send")
    {
      if(this.orderItem.service && this.orderItem.servedate != "" && this.orderItem.orderby != "")
      {
        if(this.orderItem.oid == "")
        {
          this.servSchedule = new Date(this.orderItem.servedate + 'T' + this.orderItem.servetime);
          console.log("schedule: ", this.orderItem.servedate + 'T' + this.orderItem.servetime);
          this.oItemsCollection.add({
            "oid": "",
            "timestamp": this.servSchedule,
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
            "orderby": this.orderItem.orderby,
            "beneficiary": this.orderItem.orderby,
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

            this.navCtrl.pop();
          });

        }
        else
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
      }
    }

    if(event == "discard")
    {
      this.navCtrl.pop();
    }

  }
}

