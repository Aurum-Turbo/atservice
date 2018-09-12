import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, List } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { MessageData } from '../../providers/message-data/message-data';
import { UserData } from '../../providers/user-data/user-data';
import { ChatData } from '../../providers/chat-data/chat-data';

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
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
  chatItem: ChatData;
  itemsCollection: AngularFirestoreCollection<MessageData>; //Firestore collection
  items: Observable<MessageData[]>;
  userDocument: AngularFirestoreDocument<UserData>;
  currentUser: Observable<UserData>; 
  currentUid: String;
  message = new MessageData();
  // postObj: PostData;
  private mutationObserver: MutationObserver;
  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      
      this.userDocument = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid);
      this.currentUid = firebase.auth().currentUser.uid;
    if(this.navParams.data)
    {
      this.chatItem = this.navParams.get("sender");
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
    this.dataService.loadCurUserData();
    this.mutationObserver = new MutationObserver((mutations) => {
    this.contentArea.scrollToBottom();
  });

  this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
  });
  }

  ionViewWillEnter() {
    this.itemsCollection = this.afs.collection('messages').doc(firebase.auth().currentUser.uid)
    .collection('chat', ref => {return ref.orderBy("sendAt",'asc')});

    this.items = this.itemsCollection.valueChanges();
    //this.items = this.chatItem.cmessageList;
  }
 
  onClick() {
    if(this.message.message)
    {
      this.message.receiver = this.chatItem.cid;
      this.message.sender = firebase.auth().currentUser.uid;
      this.message.time = new Date();

      //set Collection
      this.itemsCollection = this.afs.collection("messages");

      console.log("message: ", this.message);
      //save to receiver's inbox
      this.itemsCollection.doc(this.message.receiver)
      .collection('chat').add({
        "mid": "",
        "time": this.message.time,
        "sender": this.message.sender,
        "snickname": this.dataService.userDataObj.nickname,
        "savatar": this.dataService.userDataObj.avatar,
        "receiver": this.message.receiver,
        "message": this.message.message,
        "status": "reply",
        "sendAt": firebase.firestore.FieldValue.serverTimestamp()
      }).then(docRef => {
        this.itemsCollection.doc(this.message.receiver)
        .collection('chat').doc(docRef.id).update({
          "mid": docRef.id,
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .catch(error => console.log(error));

      //save to sender's inbox
      this.itemsCollection.doc(this.message.sender)
      .collection('chat').add({
        "mid": "",
        "time": this.message.time,
        "sender": this.message.sender,
        "snickname": this.dataService.userDataObj.nickname,
        "savatar": this.dataService.userDataObj.avatar,
        "receiver": this.message.receiver,
        "message": this.message.message,
        "status": "reply",
        "sendAt": firebase.firestore.FieldValue.serverTimestamp()
      }).then(docRef => {
        this.itemsCollection.doc(this.message.sender)
        .collection('chat').doc(docRef.id).update({
          "mid": docRef.id,
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .catch(error => console.log(error));


    }
  }
}
