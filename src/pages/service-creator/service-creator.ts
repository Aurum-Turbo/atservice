import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
/**
 * Generated class for the ServiceCreatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-creator',
  templateUrl: 'service-creator.html',
})
export class ServiceCreatorPage {

  servItem = new ServiceData();

  calltype = "creating";

  itemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<ServiceData>; // read collection
  types: string[] = ['Escort', 'Transport', 'House Clean'];
  units: string[] = ['Minutes','Hours', 'Weeks'];
  currencys: string[] = ['AUD','RMB','USD'];
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public navCtrl: NavController, public navParams: NavParams) {
     
      this.itemsCollection = this.afs.collection("services");
      if(navParams.data != null)
      {
        this.servItem = navParams.get("service"); 

        if(this.servItem.sid)
        {
          this.calltype = "editing";
        }
      }
      this.servItem.type = "Escort";
      this.servItem.unit = "Minutes";
      this.servItem.currency = "AUD";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceCreatorPage');
  }

  ionViewWillLeave() {
    if(this.calltype == "creating" && this.servItem.type != "" && this.servItem.description != "")
    {
      console.log("updated sid: ", this.servItem);
      this.itemsCollection.add({
        "sid": "",
        "status": "created",
        "type": this.servItem.type,
        "description": this.servItem.description,
        "duration": this.servItem.duration,
        "declaimer": this.servItem.declaimer,
        "provider": firebase.auth().currentUser.uid,
        "price": this.servItem.price,
        "unit": this.servItem.unit,
        "currency": this.servItem.currency,
        "location": this.servItem.location,
        "availability": this.servItem.availability,
        "tags": "",
        "rank": 0,
        "like": 0,
        "comments": this.servItem.comments,
        "createAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        this.itemsCollection.doc(docRef.id).update({
          "sid": docRef.id,
          "status": "updated",
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .catch(error => console.log(error));
    }

    if(this.calltype == "editing" && this.servItem.description != "")
    {
      console.log("updated sid: ", this.servItem);
      this.itemsCollection.doc(this.servItem.sid).update({
        "status": "updated",
        "description": this.servItem.description,
        "price": this.servItem.price,
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
      }); 
    }
  }
  
}
