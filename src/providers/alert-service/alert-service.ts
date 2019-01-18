import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { HomePage } from '../../pages/home/home';
import { AlertController, ToastController } from 'ionic-angular';

import { AlertData } from '../alert-data/alert-data';
import { UserData } from '../user-data/user-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertServiceProvider {

  alertCollection: AngularFirestoreCollection<AlertData>;
  alertItems: Observable<AlertData[]>;

  userCollection: AngularFirestoreCollection<UserData>; //Firestore collection

  constructor(
    private afs: AngularFirestore,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
      /* this.alertCollection = this.afs.collection('alerts', ref => {
        return ref.where("keys", "==", firebase.auth().currentUser.uid + "_unread")
          .orderBy("updateAt", 'asc');
      }); */
      this.alertCollection = this.afs.collection('alerts');
      this.alertItems = this.alertCollection.valueChanges();

      this.userCollection = this.afs.collection("users");
  }

  presentAlert(alertData: AlertData) {
    let alert = this.alertCtrl.create({
      title: alertData.type,
      subTitle: alertData.message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentToast(mesg: string) {
    let toast = this.toastCtrl.create({
      message: mesg,
      duration: 6000,
      cssClass: "customToast",
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();

  }
  
  presentPrompt(alertData: AlertData) {

    switch(alertData.type)
    {
      case "RATE": {
        let alert = this.alertCtrl.create({
          title: alertData.message,
          inputs: [
            {
              name: 'rate',
              placeholder: '5',
              type: 'number'
            }
          ],
          buttons: [
            {
              text: 'Rate Me!',
              handler: data => {
                if (data.rate >= 0 && data.rate <= 5) {
                  //store this rate
                  this.userCollection.doc(alertData.fromuid).update({
                    "rate": data.rate,
                    "updateAt": firebase.firestore.FieldValue.serverTimestamp()
                  }).then(result => {
                    this.alertCollection.doc(alertData.aid).update({
                      "keys": firebase.auth().currentUser.uid + "_read",
                      "updateAt": firebase.firestore.FieldValue.serverTimestamp()
                    })
                    this.presentToast("Thank you for rate me!");
                    console.log("update successful");})
                  .catch(err => {console.log(err);});
                } else {
                  // invalid login
                  return false;
                }
              }
            }
          ]
        });
        alert.present();
      }
    }

    
    
  }


  exitApp(){
    
  }
  
}
