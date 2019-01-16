import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, List } from 'ionic-angular';

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
import { networkInterfaces } from 'os';
import { convertUrlToDehydratedSegments } from 'ionic-angular/umd/navigation/url-serializer';

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
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
  chatsCollection: AngularFirestoreCollection<ChatData>; //Firestore collection
  UserCollection: AngularFirestoreCollection<UserData>; //Firestore collection
  mesgCollection: AngularFirestoreCollection<MessageData>; //Firestore collection
  mesgs: Observable<MessageData[]>;

  chatData: ChatData;
  mesgTyping: string = "";
  //消息发送后自动滚到该条消息
  private mutationObserver: MutationObserver;
  
  //colDocument: AngularFirestoreDocument<AngularFirestoreCollection>;

  constructor(
    private afs: AngularFirestore,
    public chatService: ChatServiceProvider,
    public navCtrl: NavController, public navParams: NavParams, public element: ElementRef) {

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
    
    //消息发送后自动滚动
    
  }
  ionViewDidEnter(){
    this.contentArea.scrollToBottom();
    console.log('ionViewDidEnter MessagePage');
  }
  

  sendMessage() {
    //console.log("this message cid: ", result);

      if(this.mesgTyping.length > 0)
      {
        this.chatService.newMessage(this.chatData, this.mesgTyping);
        let el = this.element.nativeElement.querySelector("textarea");
        el.style.height = "25px";
        this.contentArea.scrollToBottom();
        this.mesgTyping = ''
      }
      this.mutationObserver = new MutationObserver((mutations) => {
        this.contentArea.scrollToBottom();
    });
  
    this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true,
        subtree: true
    });
  }
  updateEditor(){
    let el = this.element.nativeElement.querySelector("textarea");
    el.style.overflow = "hidden";
    el.style.height = "auto";
    if (el['scrollHeight'] <= 84) { //给输入框设定一个最大的高度
          el['style'].height = el['scrollHeight'] + "px";
    }else {
         el['style'].height = "80px";
    }
  }
  
 

}
