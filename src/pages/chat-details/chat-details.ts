import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { MessageData } from '../../providers/message-data/message-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';

/**
 * Generated class for the ChatDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetailsPage {

  chatItem: MessageData;

  itemsCollection: AngularFirestoreCollection<MessageData>; //Firestore collection
  items: Observable<MessageData[]>;

  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

    if(this.navParams.data)
    {
      this.chatItem = this.navParams.get("sender");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
    this.dataService.loadCurUserData();
  }

  ionViewWillEnter() {
    this.itemsCollection = this.afs.collection('messages').doc(firebase.auth().currentUser.uid)
    .collection('chat', ref => {return ref.where("sender","==", this.chatItem.sender)
    .orderBy("time",'desc')});

    this.items = this.itemsCollection.valueChanges();
  }

}
