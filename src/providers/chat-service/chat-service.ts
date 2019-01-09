import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { UserData } from '../../providers/user-data/user-data';
import { ChatData } from '../../providers/chat-data/chat-data';
import { MessageData } from '../../providers/message-data/message-data';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import firebase from 'firebase/app';
import { resolve } from 'url';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatServiceProvider {
  userCollection: AngularFirestoreCollection<UserData>; //Firestore collection
  chatsCollection: AngularFirestoreCollection<ChatData>; //Firestore collection
  chatsQueryCollection: AngularFirestoreCollection<ChatData>; //Firestore collection
  mesgCollection: AngularFirestoreCollection<MessageData>;
  mesgQueryCollection: AngularFirestoreCollection<MessageData>;
  
  chats: Observable<ChatData[]>;
  chatMemberProfiles: UserData[];
  //chatTitle: string = "";
  //chatAvatar: string = "";
  //activeChatMemberList: string[];

  constructor(
    private afs: AngularFirestore,
  ) {
    console.log('Hello ChatServiceProvider Provider');
    //this.activeChatMemberList = new Array<string>(); 
    this.userCollection = this.afs.collection('users');
    this.chatsCollection = this.afs.collection('chats');
    this.mesgCollection = this.afs.collection('messages');

    this.chatMemberProfiles = new Array<UserData>();
  }

  getProfiles(uid: string): Observable<UserData> {

    return this.userCollection.doc<UserData>(uid).valueChanges();
    
  }

  getChatWithProfile(users: UserData[]): Observable<UserData> {
    return new Observable(observer => {
      if(users.length <= 2)
      {
        users.forEach(item => {
          if(item.uid != firebase.auth().currentUser.uid)
          {
            observer.next(item);
            observer.complete;
          }
        });
      }
    });
  }

  getSenderProfile(users: UserData[]): Observable<UserData> {
    return new Observable(observer => {
        users.forEach(item => {
          if(item.uid == firebase.auth().currentUser.uid)
          {
            observer.next(item);
            observer.complete;
          }
        });
      });
  }

  newChat(members: string[]): Promise<any> {
    return new Promise(resolve => {
      this.chatsCollection.add({
        "cid": "",
        "chatWith": null,
        "chatOwner": null,
        "members": members,
        "latestMesg": "",
        "latestMesgSender": "",
        "status": "created"
      })
      .then(docRef => {
        //console.log("this data-service members: ", members);
        this.chatsCollection.doc(docRef.id).update({
          "cid": docRef.id,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        });
        //console.log("chat page: ", docRef.id);
        resolve(docRef.id);
        //this.navCtrl.push(MessagePage, {"from": ChatPage, "ChatData": docRef.id});
      })
      .catch(error => {console.log(error); resolve(false)});
    });

  }

  isExistedChat(members: string[]): Promise<any> {
    return new Promise(resolve => {

      members.forEach(member => {
        if(member != firebase.auth().currentUser.uid)
        {
          this.chatsQueryCollection = this.afs.collection('chats', ref => {
            return ref.where('members', 'array-contains', member)
            .orderBy("updateAt", 'desc');
          });

          this.chatsQueryCollection.valueChanges().subscribe(result => {
            //console.log("isExistedChat() result: ", result.length);
            if(result.length == 1)
            {
              resolve(result[0].cid);
            }
            else
            {
              console.log("multiple chat record fund or NONE record!");
              resolve(false);
            }
          });
        }
      });
    });
  }

  getChat(cid: string): Promise<ChatData> {
    //this.activeChatMemberList.push(mid);

    //console.log("get Chat cid: ", cid);
    return new Promise(resolve => {
      this.chatsCollection.doc<ChatData>(cid).valueChanges().subscribe(chat => {
        //console.log("get Chat data: ", chat);
        chat.members.forEach(member => {
          if(member == firebase.auth().currentUser.uid)
          {
            this.userCollection.doc<UserData>(member).valueChanges().subscribe(result => {
              chat.chatOwner = result;
              //console.log("getChat() chat owner: ", result);
            });
          }
          else
          {
            if(chat.members.length < 3)
            {
              this.userCollection.doc<UserData>(member).valueChanges().subscribe(result => {
                chat.chatWith = result;
                //console.log("getChat() chat With: ", result);
              });
            }
            else
            {
              console.log("this is a group chat!");
            }
          }
        });

        resolve(chat);
      });
    });
  }

  loadChats(): Observable<ChatData[]> {
    this.chatsQueryCollection = this.afs.collection('chats', ref => {
      return ref.where('members', 'array-contains', firebase.auth().currentUser.uid)
      .orderBy("updateAt", 'desc');
    });
    
    return new Observable(observer => {
      this.chatsQueryCollection.valueChanges().subscribe(chats => {
        chats.forEach(chat => {
          //console.log("chat id: ", chat.cid, "get chat members: ", chat.members);
          chat.members.forEach(member => {
            if(member == firebase.auth().currentUser.uid)
            {
              this.userCollection.doc<UserData>(member).valueChanges().subscribe(result => {
                chat.chatOwner = result;
                //console.log("chat owner: ", result);
                observer.next(chats);
              });
            }
            else
            {
              if(chat.members.length < 3)
              {
                this.userCollection.doc<UserData>(member).valueChanges().subscribe(result => {
                  chat.chatWith = result;
                  //console.log("chat With: ", result);
                  observer.next(chats);
                });
              }
              else
              {
                console.log("this is a group chat!");
              }
            }
          });
        });

        observer.complete;
      });
    });
  }

  loadMesgs(cid: string): Observable<MessageData[]> {
    this.mesgQueryCollection = this.afs.collection('messages', ref => {
      return ref.where('cid', '==', cid)
      .orderBy("updateAt", 'asc');
    });
    
    return this.mesgQueryCollection.valueChanges();

  }

  newMessage(chatData: ChatData, mesg: string): Promise<any> {
    return new Promise(resolve => {
      if(mesg.length > 0)
      {
        this.mesgCollection.add({
          "mid": "",
          "cid": chatData.cid,
          "sender": chatData.chatOwner,
          //"senderid": this.chatData.chatOwner.uid,
          "message": mesg,
          "status": "new"
        })
        .then(docRef => {
          this.mesgCollection.doc(docRef.id).update({
            "mid": docRef.id,
            "createAt": firebase.firestore.FieldValue.serverTimestamp(),
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          });

          this.chatsCollection.doc(chatData.cid).update({
            "latestMesg": mesg,
            "latestMesgSender": chatData.chatOwner.nickname,
            "status": "new",
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .catch(error => {console.log(error);});
      }
    });      
  }

  deleteChat(chat: ChatData) {
    this.chatsCollection.doc(chat.cid).delete().then(result => {
      console.log("delete chat successfully!");
    })
    .catch(error => {console.log("delete chat failed by: ", error);});
  }

  

  deleteMessage() {}

  //loadChats(user: firebase.User) {}

}
