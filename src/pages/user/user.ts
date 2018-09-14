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
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import { ValueTransformer } from '../../../node_modules/@angular/compiler/src/util';
import { OrderCreatorPage } from '../order-creator/order-creator';


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
  
  public transList= [];
  public posList = [];
  public jobList =[];
  public orderList =[];
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


  //userDocument: AngularFirestoreDocument<UserData>;
  currentUser: Observable<UserData>; // read collection


  //userDataObj = new UserData();

  //postDate: Date;

  constructor(
              private afs: AngularFirestore,
              public dataService: DataServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams) {          
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    //this.userDataObj = this.dataService.userDataObj;
  }

  ionViewWillEnter() {
   /*  this.date = new Date();
    this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.getDaysOfMonth();
    this.loadEventThisMonth(); */

    //check user login status
    //console.log("page name: ", this.navCtrl.getActive().name);

    if(this.navCtrl.getActive().name == "UserPage")
    {
      firebase.auth().onAuthStateChanged(user => {
        if(user)
        {

          //load Current User Profile, Posts, and Services
          this.currentUser = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid).valueChanges();
          
          this.dataService.loadCurUserData();
          this.itemsCollection = this.afs.collection("posts", ref => {
            return ref.where("author","==",firebase.auth().currentUser.uid)
                      .orderBy("updateAt", 'desc');
          });

          this.items = this.itemsCollection.valueChanges();

          this.sItemsCollection = this.afs.collection("services", ref => {
            return ref.where("provider","==",firebase.auth().currentUser.uid)
                      .orderBy("updateAt", 'desc');
          })

          this.sItems = this.sItemsCollection.valueChanges();

          this.oItemsCollection = this.afs.collection("orders", ref => {
            return ref.where("service.provider","==",firebase.auth().currentUser.uid)
                      .orderBy("updateAt", 'desc');
          })

          this.oItems = this.oItemsCollection.valueChanges();

          this.jItemsCollection = this.afs.collection("jobs", ref => {
            return ref.where("acceptedby","==",firebase.auth().currentUser.uid)
                      .orderBy("updateAt", 'desc');
          })

          this.jItems = this.jItemsCollection.valueChanges();

          


          //this.userDocument = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid);
          //this.currentUser = this.userDocument.valueChanges();
          //this.userDocument.valueChanges().subscribe(snapshot => {
          //  this.userObj = snapshot;
          //});

          //load services



        }
        else
        {
          this.navCtrl.setRoot(LoginPage, {"from": UserPage});
          console.log("user is not logged in");
        }
      });
    }
  }
  
  @ViewChild('pageSlider') pageSlider: Slides;
  tabs: any = '0';
  selectTab(index) {
    this.pageSlider.slideTo(index);
  }
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  }

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }
  
  onClick(event: string, item: any) {
    if(event == "new")
    {
      //console.log("set author: ", this.userObj.nickname);
      this.navCtrl.push(EditorPage, {"post": new PostData()});
    }

    if(event == "edit")
    {
      this.navCtrl.push(EditorPage, {"post": item as PostData});
    }

    if(event == "signout")
    {
      firebase.auth().signOut();
      //this.navCtrl.push(LoginPage);
    }

    if(event == "service")
    {
      if(item)
      {
        this.navCtrl.push(ServiceCreatorPage, {"service": item as ServiceData});
      }
      else
      {
        this.navCtrl.push(ServiceCreatorPage, {"service": new ServiceData()});
      }
    }

    if(event == "order")
    {
      if(item)
      {
        this.navCtrl.push(OrderCreatorPage, {"order": item as OrderData});
      }
      else
      {
        this.navCtrl.push(OrderCreatorPage, {"order": new OrderData()});
      }
    }

    if(event == "accept")
    {
      if(item.oid != "")
      {
        this.jItemsCollection = this.afs.collection("jobs");

        this.jItemsCollection.add({
          "jid": "",
          "order": item,
          "status": "created",
          "timestamp": new Date(),
          "acceptedby": firebase.auth().currentUser.uid,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(docRef => {
          this.jItemsCollection.doc(docRef.id).update({
            "jid": docRef.id,
            "status": "updated",
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          });

          this.oItemsCollection.doc(item.oid).delete().then(result => {
            console.log("order: " + item.oid + " has converted to job successfully!");
            //need to send orderby a message
          });
        });
        //this.navCtrl.push(OrderCreatorPage, {"order": item as OrderData});
      }
      else
      {
        //this.navCtrl.push(OrderCreatorPage, {"order": new OrderData()});
      }
    }

    if(event == "decline")
    {
      if(item.oid != "")
      {
        this.oItemsCollection.doc(item.oid).delete().then(result => {
          console.log("order: " + item.oid + " has discard successfully!");

          //need to send orderby a message
        });
      }
    }

    if(event == "ready")
    {
      this.jItemsCollection.doc(item.jid).update({
          "status": "ready",
          "timestamp": new Date(),
          "acceptedby": firebase.auth().currentUser.uid,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch(err => {console.log(err)});
    }

    if(event == "proceed")
    {
      this.jItemsCollection.doc(item.jid).update({
          "status": "proceed",
          "timestamp": new Date(),
          "acceptedby": firebase.auth().currentUser.uid,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch(err => {console.log(err)});
    }

    if(event == "complete")
    {
      this.jItemsCollection.doc(item.jid).update({
          "status": "complete",
          "timestamp": new Date(),
          "acceptedby": firebase.auth().currentUser.uid,
          "createAt": firebase.firestore.FieldValue.serverTimestamp(),
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch(err => {console.log(err)});
    }

    if(event == "discard")
    {
      this.jItemsCollection.doc(item.jid).update({
        "status": "discard",
        "timestamp": new Date(),
        "acceptedby": firebase.auth().currentUser.uid,
        "createAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch(err => {console.log(err)});
    }


  }
  
  goProfile(){
    this.navCtrl.push(ProfilePage)
  }
  /* getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth() && this.date.getFullYear() === new Date().getFullYear()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var j = 0; j < thisNumOfDays; j++) {
      this.daysInThisMonth.push(j+1);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var k = 0; k < (6-lastDayThisMonth); k++) {
      this.daysInNextMonth.push(k+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var l = (7-lastDayThisMonth); l < ((7-lastDayThisMonth)+7); l++) {
        this.daysInNextMonth.push(l);
      }
    }
  } */

/*   goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  } */

  /* addEvent() {
    this.navCtrl.push(AddEventPage);
  } */

  /* loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        this.isSelected = true;
        this.selectedEvent.push(event);
      }
    });
  }

  deleteEvent(evt) {
    // console.log(new Date(evt.startDate.replace(/\s/, 'T')));
    // console.log(new Date(evt.endDate.replace(/\s/, 'T')));
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
              (msg) => {
                console.log(msg);
                this.loadEventThisMonth();
                this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
              },
              (err) => {
                console.log(err);
              }
            )
          }
        }
      ]
    });
    alert.present();
  } */

}
