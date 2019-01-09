import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MessageData } from '../../providers/message-data/message-data';
import { UserData } from '../../providers/user-data/user-data';
import { ChatData } from '../../providers/chat-data/chat-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';
import { ServiceDetailsPage } from '../service-details/service-details';
import { LoginPage } from '../login/login';
import { ChatPage } from '../chat/chat';
import { TabsPage } from '../tabs/tabs';

import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

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
  
  chatsCollection: AngularFirestoreCollection<ChatData>; //Firestore collection
  UserCollection: AngularFirestoreCollection<UserData>; //Firestore collection
  mesgCollection: AngularFirestoreCollection<MessageData>; //Firestore collection
  mesgs: Observable<MessageData[]>;

  chatData: ChatData;
  mesgTyping: string = "";


  //colDocument: AngularFirestoreDocument<AngularFirestoreCollection>;

  constructor(
    private afs: AngularFirestore,
    public chatService: ChatServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

      this.chatData = new ChatData();
      this.chatData = this.navParams.get('ChatData');
      this.UserCollection = this.afs.collection('users');
      this.chatsCollection = this.afs.collection('chats');

      
      
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {

        switch (this.navParams.get('from')) {
          /*case ServiceDetailsPage: {
            this.chatData = this.navParams.get('ChatData');
            break;
          }*/

          case ChatPage: {
            
            //this.userProfile = this.navParams.get('user');
            console.log("Message chatData: ", this.navParams.get('ChatData'));
            //this.chatWith = this.chatService.getChatWithProfile(this.chatData.members);
            //this.chatSender = this.chatService.getSenderProfile(this.chatData.members);
            this.chatData = this.navParams.get('ChatData');
            this.mesgs = this.chatService.loadMesgs(this.chatData.cid);
            break;
          }

          default: {
            //this.mesgs = this.mesgCollection.valueChanges();
            //this.mesgs = this.chatService.loadMesgs(this.chatData.cid);
            console.log("return! wrong way!");
            //this.navCtrl.popToRoot();
            break;
          }
        }
      }
      else
      {
        this.navCtrl.setRoot(LoginPage, {"from": ChatPage});
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');

  }

  

  sendMessage() {
    //console.log("this message cid: ", result);

      if(this.mesgTyping.length > 0)
      {
        this.chatService.newMessage(this.chatData, this.mesgTyping);
      }
    
  }

}
