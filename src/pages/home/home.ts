import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgxMasonryModule } from 'ngx-masonry';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';
import * as geofirex from 'geofirex';

import { ServiceDetailsPage } from '../service-details/service-details';
import { GeoServiceProvider } from '../../providers/geo-service/geo-service';
import { GeoFirePoint, GeoFireCollectionRef, GeoQueryDocument } from 'geofirex';
import { AppSettings } from '../../providers/app-setting';



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
  //for posts
  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: Observable<PostData[]>; // read collection
  geoPostsArray: Observable<GeoQueryDocument[]>;

  iconlike: string = "icon-heart-outline";

  geo = geofirex.init(firebase);
  // Masonry: any;
  // msnry: any;
  // imagesLoaded: any;
  constructor(
    private afs: AngularFirestore,
    private geoService: GeoServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
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

    //quote post in distance by 40km (which will arrived by 1 hr)
    
    //pull out the post posted by users who is in the range. 



    //this.itemsCollection = this.afs.collection("posts", ref => {return ref.orderBy("updateAt",'desc')});
    //this.items = this.itemsCollection.valueChanges();
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

  ionViewDidEnter() {
    //setTimeout(() => {}, 1000);
      /*let elem = document.querySelector('.grid');
      imagesLoaded(elem, function() {
          // all images loaded
          //  instance.utils.debug("images loaded done, instantiating packery");
          console.log('imagesloaded called');
          this.msnry = new Masonry (elem, {
            // options
            itemSelector: '.grid-item',
            percentPosition: true,  
          });
        });
      }, 1000);*/
  }

  geoQuery(pos: geofirex.GeoFirePoint) {

      const posts = this.geo.collection('posts');
      //const center = this.geo.point(pos.latitude, pos.longitude);
      const radius = 40; //40km
      const field = 'postLocation';

      this.geoPostsArray = posts.within(pos, radius, field);
  }
}
