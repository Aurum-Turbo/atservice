import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';


import { ProfilePage } from '../profile/profile';
import { EditorPage } from '../editor/editor';
import { LoginPage } from '../login/login';
import { ServiceCreatorPage } from '../service-creator/service-creator';

import { UserData } from '../../providers/user-data/user-data';
import { PostData } from '../../providers/post-data/post-data';
import { OrderData } from '../../providers/order-data/order-data';
import { JobData } from '../../providers/job-data/job-data';
import { ServiceData } from '../../providers/service-data/service-data';
import { AlertData } from '../../providers/alert-data/alert-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
//import { ValueTransformer } from '../../../node_modules/@angular/compiler/src/util';
import { OrderCreatorPage } from '../order-creator/order-creator';
import { GeoServiceProvider } from '../../providers/geo-service/geo-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { createElementCssSelector } from '@angular/compiler';


/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {


  public star: Observable<string[]>;
  public mark: number;

  public transList = [];
  public posList = [];
  public jobList = [];
  public orderList = [];
  oid: string; //order id
  timestamp: string;
  status: string;
  type: string;
  /* Info */
  service: ServiceData;
  /* Pricing */
  quantity: string;
  subtotal: string;
  servedate: string;
  servetime: string;
  servelocation: string;
  note: string;
  /* Parties */
  orderby: any;
  beneficiary: any;
  email: string;
  phone: string;
  /* for quote and search */
  tags: string[];
  /* date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  eventList: any;
  selectedEvent: any;
  isSelected: any; */

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: Observable<PostData[]>;

  sItemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  sItems: Observable<ServiceData[]>;

  oItemsCollection: AngularFirestoreCollection<OrderData>; //Firestore collection
  oItems: Observable<OrderData[]>;

  jItemsCollection: AngularFirestoreCollection<JobData>; //Firestore collection
  jItems: Observable<JobData[]>;

  alertCollection: AngularFirestoreCollection<AlertData>;
  alertItems: Observable<AlertData[]>;


  //userDocument: AngularFirestoreDocument<UserData>;
  currentUser: Observable<UserData>; // read collection
  userStars: string[] = null;
  userAddressArray: string[];
  selectedUserLocation: string = "";
  serviceEnabled: string = "Enabled";

  //userDataObj = new UserData();

  //postDate: Date;

  constructor(
    private afs: AngularFirestore,
    private geoService: GeoServiceProvider,
    public loginService: LoginServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
    //this.currentUser = new UserData();        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    //this.userDataObj = this.dataService.userDataObj;
  }

  ionViewWillEnter() {

    this.loginService.isUserLogined().then(result => {
      if(result)
      {
        //load user
        this.currentUser = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid).valueChanges();
        this.currentUser.subscribe(result => {
          this.userStars = this.getStars(result.rate);
        });

        //load geo info
        if (this.geoService.curLocation) {
          this.geoService.posToAddr(this.geoService.curLocation).then(addresses => {
            this.userAddressArray = addresses;
            this.selectedUserLocation = addresses[(addresses.length-1)];
            console.log("addresses: ", this.selectedUserLocation);
          })
          .catch(err => { console.log(err); });
        }

        //load service, order, job and posts.
        this.itemsCollection = this.afs.collection("posts", ref => {
          return ref.where("author", "==", firebase.auth().currentUser.uid)
            .orderBy("updateAt", 'desc');
        });

        this.items = this.itemsCollection.valueChanges();

        this.sItemsCollection = this.afs.collection("services", ref => {
          return ref.where("provider", "==", firebase.auth().currentUser.uid)
            .orderBy("updateAt", 'desc');
        })

        this.sItems = this.sItemsCollection.valueChanges();

        this.oItemsCollection = this.afs.collection("orders", ref => {
          return ref.where("service.provider", "==", firebase.auth().currentUser.uid)
            .orderBy("timestamp", 'asc');
        })

        this.oItems = this.oItemsCollection.valueChanges();

        this.jItemsCollection = this.afs.collection("jobs", ref => {
          return ref.where("acceptedby", "==", firebase.auth().currentUser.uid)
            .orderBy("timestamp", 'asc');
        })

        this.jItems = this.jItemsCollection.valueChanges();


        this.alertCollection = this.afs.collection("alerts");

      }
      else
      {
        console.log("user logout!");
        this.navCtrl.setRoot(LoginPage, {"from": UserPage});
      }
      
    })
    .catch(err => {console.log(err);});

  }



  /*@ViewChild('pageSlider') pageSlider: Slides;
  tabs: any = '0';
  selectTab(index) {
    this.pageSlider.slideTo(index);
  }
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  } */
  tabs: any = "0";

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }

  onClick(event: string, item: any) {
    if (event == "new") {
      //console.log("set author: ", this.userObj.nickname);
      this.navCtrl.push(EditorPage, { "post": new PostData() });
    }

    if (event == "edit") {
      this.navCtrl.push(EditorPage, { "post": item as PostData });
    }

    if (event == "signout") {
      firebase.auth().signOut().then(reuslt => {
        this.navCtrl.setRoot(LoginPage, {"from": UserPage});
      })
      .catch(err => {console.log(err);});
      //this.navCtrl.parent.parent.setRoot(LoginPage);
      //this.navCtrl.popToRoot();
    }

    if (event == "service") {
      if (item) {
        this.navCtrl.push(ServiceCreatorPage, { "service": item as ServiceData });
      }
      else {
        this.navCtrl.push(ServiceCreatorPage, { "service": new ServiceData() });
      }
    }

    if (event == "order") {
      if (item) {
        this.navCtrl.push(OrderCreatorPage, { "order": item as OrderData });
      }
      else {
        this.navCtrl.push(OrderCreatorPage, { "order": new OrderData() });
      }
    }

    if (event == "accept") {
      if (item.oid != "") {
        this.jItemsCollection = this.afs.collection("jobs");

        this.jItemsCollection.add({
          "jid": "",
          "order": item,
          "status": "created",
          "timestamp": item.timestamp,
          "acceptedby": firebase.auth().currentUser.uid,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        })
          .then(docRef => {
            this.jItemsCollection.doc(docRef.id).update({
              "jid": docRef.id,
              "status": "updated",
              "acceptAt": firebase.firestore.FieldValue.serverTimestamp(),
              "updateAt": firebase.firestore.FieldValue.serverTimestamp()
            });

            this.oItemsCollection.doc(item.oid).delete().then(result => {
              console.log("order: " + item.oid + " has converted to job successfully!");
              //need to send orderby a message
            });
          });
        //this.navCtrl.push(OrderCreatorPage, {"order": item as OrderData});
      }
      else {
        //this.navCtrl.push(OrderCreatorPage, {"order": new OrderData()});
      }
    }

    if (event == "decline") {
      if (item.oid != "") {
        this.oItemsCollection.doc(item.oid).delete().then(result => {
          console.log("order: " + item.oid + " has discard successfully!");

          //need to send orderby a message
        });
      }
    }

    if (event == "ready") {
      this.jItemsCollection.doc(item.jid).update({
        "status": "ready",
        //"timestamp": new Date(),
        "acceptedby": firebase.auth().currentUser.uid,
        "readyAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
        .catch(err => { console.log(err) });
    }

    if (event == "proceed") {
      this.jItemsCollection.doc(item.jid).update({
        "status": "proceed",
        //"timestamp": new Date(),
        "acceptedby": firebase.auth().currentUser.uid,
        "proceedAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
        .catch(err => { console.log(err) });
    }

    if (event == "complete") {
      this.jItemsCollection.doc(item.jid).update({
        "status": "complete",
        //"timestamp": new Date(),
        "acceptedby": firebase.auth().currentUser.uid,
        "completeAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        console.log("send alert: ", item);
        this.alertCollection.add({
          "aid": "",
          "keys": item.order.orderby + "_unread", 
          "fromuid": firebase.auth().currentUser.uid,
          "fromWho": null,
          "type": "RATE",
          "message": "Please help me to improve my service, and rate me 5!",
          "response": ""
        })
        .then(docRef => {
          this.alertCollection.doc(docRef.id).update({
            "aid": docRef.id,
            "createAt": firebase.firestore.FieldValue.serverTimestamp(),
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .catch(err => { console.log(err) });
      })
      .catch(err => { console.log(err) });

    }

    if (event == "discard") {
      this.jItemsCollection.doc(item.jid).update({
        "status": "discard",
        "timestamp": new Date(),
        "acceptedby": firebase.auth().currentUser.uid,
        "discardAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
        .catch(err => { console.log(err) });
    }


  }

  goProfile() {
    this.navCtrl.push(ProfilePage, {"address": this.userAddressArray});
  }

  delService(item: ServiceData) {
    if(item)
    {
      this.sItemsCollection.doc(item.sid).delete().then(result => {
        console.log("delete Service successfully!");
      })
      .catch(err => {console.log("delete Service failed by: ", err);});
    }
  }

  delPost(item: PostData) {
    if(item)
    {
      this.itemsCollection.doc(item.pid).delete().then(result => {
        console.log("delete Post successfully!");
      })
      .catch(err => {console.log("delete Post failed by: ", err);});
    }
    
  }

  toggleAvail(item: ServiceData) {
    if(item.availability)
    {
      this.serviceEnabled = "Enable";
      this.sItemsCollection.doc(item.sid).update({"availability": false}).then(result => {
        console.log("disable Service successfully!");
      })
      .catch(err => {console.log("disable Service failed by: ", err);});
    }
    else
    {
      this.serviceEnabled = "Disable";
      this.sItemsCollection.doc(item.sid).update({"availability": true}).then(result => {
        console.log("Enable Service successfully!");
      })
      .catch(err => {console.log("disable Service failed by: ", err);});

    }
  }

  onChange() {
    console.log("selected option: ", this.selectedUserLocation);
  }

  getStars(rate: number): string[] {
    //let rating: number = 3.4; /* rating的值预设固定，拿到数据后可以自动显示 */
    console.log("rank: ",rate);
    let stars: string[] = [];
    for (var i = 1; i <= 5; i++)
    {
      if(i <= Math.floor(rate))
      {
        stars[i] = "icon-star";
      }
      else
      {
        if(i == Math.round(rate))
          stars[i] = "icon-star-half";
        else
          stars[i] =  "icon-star-outline";
      }
    //this.onEvent("onRates", index, e);
    };
    console.log("star: ", stars);
    return stars;
  }
}
