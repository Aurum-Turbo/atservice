import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';
import { PostData } from '../../providers/post-data/post-data';
import { MessageData } from '../../providers/message-data/message-data';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataServiceProvider } from '../../providers/data-service/data-service';

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
  date: Date = new Date();
  postObj: PostData;
  message = new MessageData();

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceDetailsPage');
    this.dataService.loadCurUserData();
  }

  onClick() {

    console.log("message: ", this.message.message);
    if(this.message.message)
    {
      this.message.receiver = this.postObj.author;
      this.message.sender = firebase.auth().currentUser.uid;
      this.message.time = (new Date()).toString();

      this.itemsCollection.doc(this.message.receiver)
      .collection('chat').add({
        "mid": "",
        "time": this.message.time,
        "sender": this.message.sender,
        "snickname": this.dataService.userDataObj.nickname,
        "savatar": this.dataService.userDataObj.avatar,
        "receiver": this.message.receiver,
        "message": this.message.message,
        "status": "sent",
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

}
