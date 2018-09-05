import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MessageData } from '../../providers/message-data/message-data';
import { UserData } from '../../providers/user-data/user-data';

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
              if(item.sender != (firebase.auth().currentUser.uid))
              {
                var senderIndex = this.senderList.indexOf(item.sender);
                if(senderIndex < 0)
                {
                  this.senderList.push(item.sender);
                  this.msgList.push(item);
                }
                else
                {
                  var new_time = (new Date(item.time)).getTime();
                  var old_time = (new Date(this.msgList[senderIndex].time)).getTime();
                  if(new_time > old_time)
                  {
                    this.msgList.splice(senderIndex,1,item);
                  }
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

  onClick(item: MessageData) {
    if(item)
    {
      this.navCtrl.push(ChatDetailsPage,{"sender": item});
    }
  }

}
