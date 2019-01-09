import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { UserData } from '../../providers/user-data/user-data';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import firebase from 'firebase/app';

import { LoginPage } from '../login/login';
import { MessagePage } from '../message/message';
import { ChatData } from '../../providers/chat-data/chat-data';
import { ServiceDetailsPage } from '../service-details/service-details';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  //currentUser: Observable<UserData>;
  chatsCollection: AngularFirestoreCollection<ChatData>; //Firestore collection
  userCollection: AngularFirestoreCollection<UserData>;
  chats: Observable<ChatData[]>;
  memberList: string[];

  constructor(
    private afs: AngularFirestore,
    public chatService: ChatServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.userCollection = this.afs.collection('users');

    this.memberList = this.navParams.get('chatMemberList');
    this.chats = this.chatService.loadChats();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {

      if (user) 
      {
        //configure the chats query

        //console.log("page from: ", this.navParams.get('from'), "memberList: ", this.memberList);

        switch (this.navParams.get('from')) {
          case ServiceDetailsPage: {
            //need to create a new chat and open message page
            this.chatService.isExistedChat(this.memberList).then(result => {
              if (result) {
                this.chatService.getChat(result).then(chatData => {
                  //console.log("chat page: Chat already existed!");
                  this.navCtrl.push(MessagePage, { "from": ChatPage, "ChatData": chatData });
                })
                .catch(err => { console.log(err); });
              }
              else 
              {
                //console.log("enter new Chat!");
                this.chatService.newChat(this.memberList).then(result => {
                  this.chatService.getChat(result).then(chatData => {
                    //console.log("no Chat created one new chat page getChat(): ", chatData);
                    this.navCtrl.push(MessagePage, { "from": ChatPage, "ChatData": chatData });
                  })
                  .catch(err => { console.log(err); });
                })
                .catch(error => { console.log(error); });
              }
            })
            .catch(error => { console.log(error); });

            /*
            this.chatService.newChat(this.navParams.get('chatMemberList')).then(result => {
              this.chatService.getChat(result).then(chatData => {
                console.log("chat page getChat(): ", chatData);
                this.navCtrl.push(MessagePage, {"from": ChatPage, "ChatData": chatData});
              })
              .catch(err => {console.log(err);});
            })
            .catch(error => {console.log(error);});
            */
            break;
          }
          case LoginPage: {
            //get current user profile
            //this.curUserProfile = this.navParams.get('user');
            //search all the chats
            this.chats = this.chatService.loadChats();
            break;
          }
          default: {
            console.log("called the default! ");
            //this.chatWithSingle = this.chatService.getChatWithProfile(chatData.members);
            //this.chats = this.chatsCollection.valueChanges();


            this.chats = this.chatService.loadChats();

            /*this.chats.subscribe(chatData => {
              //this.chatWithSingle = this.chatService.getChatWithProfile(chatData);
            })*/
            /*this.afs.collection('users').doc<UserData>(firebase.auth().currentUser.uid).valueChanges().subscribe(
              userInfo => {
                //this.curUserProfile = userInfo;
                this.chats = this.chatsCollection.valueChanges();
              }
            );*/
            break;
          }
        }

      }
      else 
      {
        this.navCtrl.setRoot(LoginPage, { "from": ChatPage });
      }
    });
  }

  onClick(item: ChatData) {
    this.navCtrl.push(MessagePage, { "from": ChatPage, "ChatData": item });
  }

  delChat(item: ChatData) {
    console.log("delChat Chat: ", item);
    this.chatService.deleteChat(item);
    this.chats = this.chatService.loadChats();
  }

}
