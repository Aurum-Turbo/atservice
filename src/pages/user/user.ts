import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';


import { ProfilePage } from '../profile/profile';
import { EditorPage } from '../editor/editor';

import { UserData } from '../../providers/user-data/user-data';
import { ServiceData } from '../../providers/service-data/service-data';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';


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
  public star: string[]=[];
  public mark: number;
  
  public transList= [];
  public posList = [];
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  eventList: any;
  selectedEvent: any;
  isSelected: any;
  
  itemsCollection: AngularFirestoreCollection<ServiceData>; //Firestore collection
  items: Observable<ServiceData[]>;

  userDocument: AngularFirestoreDocument<UserData>;
  currentUser: Observable<UserData>; // read collection
  //currentUser: UserData;

  constructor(
              private afs: AngularFirestore,
              public dataService: DataServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private calendar: Calendar) {          
    //this.userDataObj = this.dataService.userDataObj;

    for(let i=0; i<10; i++){
      this.transList.push('这是第'+i+'条数据')
      this.posList.push("assets/imgs/0"+i+".jpeg")
    };
    
  }
  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.getDaysOfMonth();
    this.loadEventThisMonth();

    //this.userDataObj = this.dataService.userDataObj;
    //console.log("user.ts - constructor - userData: ", this.userDataObj); 
    this.itemsCollection = this.afs.collection("services", ref => {
      return ref.where("uid","==",firebase.auth().currentUser.uid)
                .orderBy("rank");
    });
    this.items = this.itemsCollection.valueChanges();
    
    
    this.userDocument = this.afs.doc<UserData>('users/' + firebase.auth().currentUser.uid);
    this.currentUser = this.userDocument.valueChanges();
    this.currentUser.subscribe(observer => {
      if(observer.rate)
      {
        this.getRank(observer.rate);
      }
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    //this.getRank();
  }
  @ViewChild('pageSlider') pageSlider: Slides;
  tabs: any = '0';
  selectTab(index) {
    this.pageSlider.slideTo(index);
  }
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  }
  onClick(event: string) {
    if(event == "new")
    {
      this.navCtrl.push(EditorPage);
    }
  }
  getRank(rate: number) {
    //let rating: number = 3.4; /* rating的值预设固定，拿到数据后可以自动显示 */
    console.log("rank: ",rate);
    //this.mark = rate;
    for (var i = 1; i <= 5; i++)
    {
      if(i <= Math.floor(rate))
        this.star[i] = "icon-star";
      else
      {
        if(i == Math.round(rate))
          this.star[i] = "icon-star-half";
        else
          this.star[i] =  "icon-star-outline";
      }
    //this.onEvent("onRates", index, e);
    };
    console.log("star: ", this.star);
  }
  goProfile(){
    this.navCtrl.push(ProfilePage)
  }
  getDaysOfMonth() {
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
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  /* addEvent() {
    this.navCtrl.push(AddEventPage);
  } */

  loadEventThisMonth() {
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
  }

}
