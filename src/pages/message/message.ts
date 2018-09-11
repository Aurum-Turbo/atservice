import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MessageData } from '../../providers/message-data/message-data';
import { UserData } from '../../providers/user-data/user-data';
import { ChatData } from '../../providers/chat-data/chat-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';
import { ChatDetailsPage } from '../chat-details/chat-details';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  msgList: MessageData[] = [];
  senderList: string[] = [];

  chatList: ChatData[] = [];
  chatItem = new ChatData();
  chatNameList: string[] = [];


  itemsCollection: AngularFirestoreCollection<MessageData>; //Firestore collection
  items: Observable<MessageData[]>;

  //colDocument: AngularFirestoreDocument<AngularFirestoreCollection>;

  constructor(
    private afs: AngularFirestore,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  ionViewWillEnter() {
    if(this.navCtrl.getActive().name == "MessagePage")
    {
      firebase.auth().onAuthStateChanged(user => {
        if(user)
        {
          console.log("user is logged in: ", user);
          //get update senderlist
          this.afs.collection('messages').doc(firebase.auth().currentUser.uid).collection<MessageData>('chat').valueChanges().subscribe(snapshot => {
            snapshot.forEach(item => {

              var sIndex = this.chatNameList.indexOf(item.sender);
              var rIndex = this.chatNameList.indexOf(item.receiver);

              if(item.sender == firebase.auth().currentUser.uid)
              {
                if(rIndex > -1)
                {
                  if(item.time > this.chatList[rIndex].cntime)
                  {
                    this.chatList[rIndex].cnmessage = item.message;
                    this.chatList[rIndex].cntime = item.time;
                  }
                }
              }

              if(item.receiver == firebase.auth().currentUser.uid)
              {
                if(sIndex > -1)
                {
                  if(item.time > this.chatList[sIndex].cntime)
                  {
                    this.chatList[sIndex].cnmessage = item.message;
                    this.chatList[sIndex].cntime = item.time;
                  }
                }
                else
                {
                  this.chatItem.cid = item.sender;
                  this.chatItem.cavatar = item.savatar;
                  this.chatItem.cnmessage = item.message;
                  this.chatItem.cntime = item.time;
                  this.chatItem.ctitle = item.snickname;

                  this.chatList.push(this.chatItem);
                  this.chatNameList.push(item.sender);
                }
              }
            });
          });
        }
        else
        {
          this.navCtrl.setRoot(LoginPage, {"from": MessagePage});
          console.log("user is not logged in");
        }
      });
    }
  }

  onClick(item: ChatData) {
    if(item)
    {
      this.navCtrl.push(ChatDetailsPage,{"sender": item});
    }
  }

}
