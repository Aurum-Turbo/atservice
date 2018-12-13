import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, LoadingController, Loading, AlertController, ItemSliding, Item } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
// import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgxMasonryModule } from 'ngx-masonry';
import 'rxjs/add/operator/map';
import firebase from 'firebase/app';

import { ServiceDetailsPage } from '../service-details/service-details';
// import { observable } from 'rxjs';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { containerEnd } from '@angular/core/src/render3/instructions';

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
  exb= true;
  //for posts
  
  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  items: Observable<PostData[]>; // read collection

  iconlike: string = "icon-heart-outline";
  // Masonry: any;
  // msnry: any;
  // imagesLoaded: any;
  // cardHeight: any ;
  constructor(
    private afs: AngularFirestore,
    // public dataService: DataServiceProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertServiceProvider: AlertServiceProvider,
    public alertCtrl: AlertController
    ) {  
  }

  ionViewDidLoad() {
     this.presentConfirm();
     console.log('ionViewDidLoad HomePage');
     
    }
    
    ionViewWillEnter(){
      this.itemsCollection = this.afs.collection("posts", ref => {return ref.orderBy("updateAt",'desc')});
      this.items = this.itemsCollection.valueChanges();
    }
    /* presentLoadingDefault(){
      let loading = this.loadingCtrl.create({
        content:'Please wait...'
      });
      console.log(loading);
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 5000);
    } */
    
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
      let item:any;
      console.log(this.content.contentHeight)

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
    };
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
     this.content.scrollTo(0,40);
   }       
   
}
