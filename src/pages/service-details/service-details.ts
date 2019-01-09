import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data/service-data';
import { PostData } from '../../providers/post-data/post-data';
import { MessageData } from '../../providers/message-data/message-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { OrderCreatorPage } from '../order-creator/order-creator';
import { LoginPage } from '../../pages/login/login';
import { ChatPage } from '../../pages/chat/chat';
import { OrderData } from '../../providers/order-data/order-data';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

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
    public chatService: ChatServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.data != null)
    {
      this.postObj = navParams.get("post");
      console.log("get navParams: ", this.navParams.data);
    }

    this.itemsCollection = this.afs.collection("messages");

    console.log("get post: ", this.postObj);
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
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          if(firebase.auth().currentUser.uid != this.postObj.author)
          {
            var memberList = new Array<string>();
            memberList.push(this.postObj.author);
            memberList.push(firebase.auth().currentUser.uid);
            this.navCtrl.parent.select(1);
            this.navCtrl.setRoot(ChatPage, {"from": ServiceDetailsPage, "chatMemberList": memberList});

          }
          else
          {
            console.log("Post is posted by user himself");
          }
        }
        else
        {
          console.log("user is not logged in!");
          this.navCtrl.setRoot(LoginPage, { "from": ServiceDetailsPage });
        }
      });
      
    }

    if(event == "service" && item)
    {
      var newOrder = new OrderData();
      newOrder.service = item as ServiceData;
      newOrder.orderby = firebase.auth().currentUser.uid;
      this.navCtrl.push(OrderCreatorPage,{"order": newOrder});
    }
  }

}
