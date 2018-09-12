import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgxMasonryModule } from 'ngx-masonry';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';

import { ServiceDetailsPage } from '../service-details/service-details';

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

  iconlike: string = "icon-heart-outline";
  // Masonry: any;
  // msnry: any;
  // imagesLoaded: any;
  constructor(
    private afs: AngularFirestore,
    //public dataService: DataServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    this.itemsCollection = this.afs.collection("posts", ref => {return ref.orderBy("updateAt",'desc')});
    this.items = this.itemsCollection.valueChanges();

    this.items.subscribe(snapshot => {
      console.log("loaded items: ", snapshot);
    })
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
}
