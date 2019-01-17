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

import { FormControl } from '@angular/forms';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
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

  items: ChatData[];
  memberList: string[];
  previousPage: any;

  //for search
  searchTerm: string = "";
  searchControl: FormControl;

  constructor(
    private afs: AngularFirestore,
    public chatService: ChatServiceProvider,
    public loginService: LoginServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.userCollection = this.afs.collection('users');

    this.memberList = this.navParams.get('chatMemberList');
    //this.chats = this.chatService.loadChats();
    this.previousPage = this.navParams.get('from');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    
  }
  
  ionViewWillEnter() {
    this.setFilteredItems();
    this.loginService.isUserLogined().then(result => {
      if(result)
      {
        this.chats = this.chatService.loadChats();
        if(!this.items)
        {
          this.chats.subscribe(results => {
            this.items = results;
          });
        }
      }
      else
      {
        this.navCtrl.setRoot(LoginPage, {"from": ChatPage});
      }
    })
    .catch(err => {console.log(err);});
  }

  onClick(item: ChatData) {
    this.navCtrl.push(MessagePage, { "from": ChatPage, "ChatData": item });
  }

  delChat(item: ChatData) {
    console.log("delChat Chat: ", item);
    this.chatService.deleteChat(item);
    this.chats = this.chatService.loadChats();
  }

  setFilteredItems() {
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.chats.subscribe(results => {
        this.items = results.filter(item => {
          if(item.chatWith)
          {
            console.log("search: ", item.chatWith.nickname);
            return (item.chatWith.nickname).toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          }
        });
      });
    });
  }

}
