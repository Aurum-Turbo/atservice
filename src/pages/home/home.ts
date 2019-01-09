import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, LoadingController, Loading, AlertController, ItemSliding, Item } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
// import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgxMasonryModule } from 'ngx-masonry';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

import firebase from 'firebase/app';
import * as geofirex from 'geofirex';

import { ServiceDetailsPage } from '../service-details/service-details';
// import { observable } from 'rxjs';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { containerEnd } from '@angular/core/src/render3/instructions';
import { GeoServiceProvider } from '../../providers/geo-service/geo-service';
import { GeoFirePoint, GeoFireCollectionRef, GeoQueryDocument } from 'geofirex';
import { AppSettings } from '../../providers/app-setting';
import { FormControl } from '@angular/forms';



/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
  //@Input() data: any;
  //@Input() events: any;
  exb= true;
  //for posts

  //for search
  searchTerm: string = "";
  searchControl: FormControl;
  
  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: GeoQueryDocument[]; // read collection
  geoPostsArray: Observable<GeoQueryDocument[]>;

  iconlike: string = "icon-heart-outline";

  geo = geofirex.init(firebase);
  // isClicked = false;
  // Masonry: any;
  // msnry: any;
  // imagesLoaded: any;
  // cardHeight: any ;
  constructor(
    private afs: AngularFirestore,
    // public dataService: DataServiceProvider,
    public loadingCtrl: LoadingController,
    private geoService: GeoServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertServiceProvider: AlertServiceProvider,
    public alertCtrl: AlertController
    ) {  
      this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
     this.presentConfirm();
     this.setFilteredItems();

     console.log('ionViewDidLoad HomePage');
    //  console.log(this.isClicked);
  }

  setFilteredItems() {
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.geoPostsArray.subscribe(results => {
        this.items = results.filter( item => {
          return item.description.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
      });
    });
  }

  ionViewWillEnter(){
    //get location 

    if(!this.geoService.curLocation)
    {
      this.geoService.geoCurLocation().then(pos => {
        console.log("have already get the current location");
        this.geoQuery(this.geoService.curLocation);
      })
      .catch(err => {console.log(err);});
    }
    else
    {
      this.geoQuery(this.geoService.curLocation);
    }
  }

  onClick(event: string, item: any) {
    if(event == "detail")
    {
      this.navCtrl.push(ServiceDetailsPage, {"post": item as PostData});
    }
      
    if(event == "like")
    {
        
      let updateLike = (<PostData>item).likeList;
      if(updateLike.indexOf(firebase.auth().currentUser.uid) < 0)
      {
        updateLike.push(firebase.auth().currentUser.uid);
        this.itemsCollection.doc((<PostData>item).pid).update({
          "likeList": updateLike,
          "like": updateLike.length
        });
      }
    }
  }

  presentConfirm() {
      let alert = this.alertCtrl.create({
        title: '未满18岁请退出此网站',
        message: 'If you are less than 18 years old, Please exit this site',
        buttons: [
          {
            text: 'Exit',
            role: 'cancel',
            handler: () => {
              window.location.href="http://www.google.com.au"
            }
          },
          {
            text: 'Enter',
            handler: () => {
              this.extBlur();
            }
          }
        ],
        enableBackdropDismiss: false // 点窗口其它地方确定弹窗不会消失
      });
      alert.present();
  }
    // 点确定毛玻璃效果消失
  extBlur(){
     this.exb = false;
  }       

  geoQuery(pos: geofirex.GeoFirePoint) {

      const posts = this.geo.collection('posts');
      //const center = this.geo.point(pos.latitude, pos.longitude);
      const radius = 40; //40km
      const field = 'postLocation';

      this.geoPostsArray = posts.within(pos, radius, field);
      
      if(!this.items)
      {
        this.geoPostsArray.subscribe(results => {
          this.items = results;
        });
      }
  }
 /*  beenRead(){
    this.isClicked = true;
    console.log(this.isClicked);
  } */
}
