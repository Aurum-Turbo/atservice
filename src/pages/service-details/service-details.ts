import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';
import { PostData } from '../../providers/post-data/post-data';
import { MessageData } from '../../providers/message-data/message-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { OrderCreatorPage } from '../order-creator/order-creator';
import { HomePage } from '../home/home';
import { LoginPage } from '../../pages/login/login';
import { ChatPage } from '../../pages/chat/chat';
import { MessagePage } from '../../pages/message/message';
import { OrderData } from '../../providers/order-data/order-data';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

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
  @ViewChild('slider') slider: Slides;

  date: Date = new Date();
  postObj: PostData;
  message = new MessageData();

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection

  sItemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  sItems: Observable<ServiceData[]>;

  constructor(
    private afs: AngularFirestore,
    private loginService: LoginServiceProvider,
    private chatService: ChatServiceProvider,
    private alertService: AlertServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.data != null)
    {
      this.postObj = navParams.get("post");
      console.log("get navParams: ", this.navParams.data);
    }

    this.itemsCollection = this.afs.collection("messages");

    console.log("get post: ", this.postObj);
    // console.log("get service: ", this.serviceObj);
    console.log("Date: ", this.date);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceDetailsPage');
      this.slider.autoHeight = true;
  }

  ionViewWillEnter() {

    //this.dataService.loadCurUserData();
    this.sItemsCollection = this.afs.collection("services", ref => {
      return ref.where("provider", "==", this.postObj.author);
    });
      
    this.sItems = this.sItemsCollection.valueChanges();
    
  }

  onClick(event: string, item: any) {

    //console.log("message: ", this.message.message);
    if(event == "chat")
    {     
      if(this.loginService.isUserLoggedIn)
      {
        if(firebase.auth().currentUser.uid != this.postObj.author)
          {
            var memberList = new Array<string>();
            memberList.push(this.postObj.author);
            memberList.push(firebase.auth().currentUser.uid);

            this.chatService.isExistedChat(memberList).then(result => {
              if (result) {
                this.chatService.getChat(result).then(chatData => {
                  this.navCtrl.push(MessagePage, {"ChatData": chatData});
                })
                .catch(err => { console.log(err); });
              }
              else 
              {
                //console.log("enter new Chat!");
                this.chatService.newChat(memberList).then(result => {
                  this.chatService.getChat(result).then(chatData => {
                    //console.log("no Chat created one new chat page getChat(): ", chatData);
                    this.navCtrl.push(MessagePage, {"ChatData": chatData});
                  })
                  .catch(err => { console.log(err); });
                })
                .catch(error => { console.log(error); });
              }
            })
            .catch(error => { console.log(error); });
            
            //this.navCtrl.setRoot(TabsPage, {"from": ServiceDetailsPage, "chatMemberList": memberList, "TabIndex": 1});
          }
          else
          {
            //console.log("Post is posted by user himself");
            this.alertService.presentToast("[WARN] It's your own Post! You cannot talk to yourself through Post.");
          }

      }
      else
      {
        console.log("user is not logged in!");
        this.alertService.presentToast("[WARN] You need login to use this function!");
        this.navCtrl.push(LoginPage, {"from": ServiceDetailsPage});

      }
      
      /* this.loginService.isUserLogined().then(result => {
        if(result == true)
        {
          if(firebase.auth().currentUser.uid != this.postObj.author)
          {
            var memberList = new Array<string>();
            memberList.push(this.postObj.author);
            memberList.push(firebase.auth().currentUser.uid);

            this.chatService.isExistedChat(memberList).then(result => {
              if (result) {
                this.chatService.getChat(result).then(chatData => {
                  //console.log("chat page: Chat already existed!");
                  //this.navCtrl.setRoot(HomePage);
                  this.navCtrl.push(MessagePage, {"ChatData": chatData});
                })
                .catch(err => { console.log(err); });
              }
              else 
              {
                //console.log("enter new Chat!");
                this.chatService.newChat(memberList).then(result => {
                  this.chatService.getChat(result).then(chatData => {
                    //console.log("no Chat created one new chat page getChat(): ", chatData);
                    this.navCtrl.push(MessagePage, {"ChatData": chatData});
                  })
                  .catch(err => { console.log(err); });
                })
                .catch(error => { console.log(error); });
              }
            })
            .catch(error => { console.log(error); });
            
            //this.navCtrl.setRoot(TabsPage, {"from": ServiceDetailsPage, "chatMemberList": memberList, "TabIndex": 1});
          }
          else
          {
            console.log("Post is posted by user himself");
          }
        }
        else
        {
          console.log("user is not logged in!");
          this.navCtrl.push(LoginPage, {"from": ServiceDetailsPage});
        }
      })
      .catch(err => {console.log(err);}); */
    }

    if(event == "service" && item)
    {
      //if want to order a service has to be login.
      if(this.loginService.isUserLoggedIn)
      {
        if(item.provider != firebase.auth().currentUser.uid)
          {
            var newOrder = new OrderData();
            newOrder.service = item as ServiceData;
            newOrder.orderby = firebase.auth().currentUser.uid;
            this.navCtrl.push(OrderCreatorPage,{"order": newOrder});
          }
          else
          {
            this.alertService.presentToast("[WARN] It's your own services! You cannot book your own service through Post.");
          }

      }
      else
      {
        this.navCtrl.push(LoginPage, {"from": ServiceDetailsPage});
      }
      /* this.loginService.isUserLogined().then(result => {
        if(result == true)
        {
          if(item.provider != firebase.auth().currentUser.uid)
          {
            var newOrder = new OrderData();
            newOrder.service = item as ServiceData;
            newOrder.orderby = firebase.auth().currentUser.uid;
            this.navCtrl.push(OrderCreatorPage,{"order": newOrder});
          }
          else
          {
            console.log("you are the same as the provider!");
          }
        }
        else
        {
          this.navCtrl.push(LoginPage, {"from": ServiceDetailsPage});
        }
      })
      .catch(err => {console.log(err);}); */


      /* firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          if(item.provider != firebase.auth().currentUser.uid)
          {
            var newOrder = new OrderData();
            newOrder.service = item as ServiceData;
            newOrder.orderby = firebase.auth().currentUser.uid;
            this.navCtrl.push(OrderCreatorPage,{"order": newOrder});
          }
          else
          {
            console.log("you are the same as the provider!");
          }
        }
        else
        {
          
        }
      }); */
    }
  }

}
