import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { PostData } from '../../providers/post-data/post-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Timestamp } from '../../../node_modules/rxjs';

//import { QuillModule } from 'ngx-quill';


/**
 * Generated class for the EditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})



export class EditorPage {
  
  postObj = new PostData();
  calltype = "creating";

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection
  
  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

      this.itemsCollection = this.afs.collection("posts");
      
      if(navParams.data != null)
      {
        this.postObj = navParams.data; 
        if(this.postObj.pid)
        {
          this.calltype = "editing";
        }
        console.log("edit page: ", this.postObj);
      }
      

      /*for(let i:0; i<8; i++){
        this.imgsList.push('../../assets/imgs/0'+i+'.jpeg')
      }*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
  }

  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    //console.log(this.serviceObj);
    //this.dataService.updateServiceList("new",this.serviceObj);
    if(this.calltype == "creating" && this.postObj.images != [] && this.postObj.description != null)
    { 
      //this.dataService.updateServiceList("new",this.serviceObj);
      var currentDate = new Date();
      console.log("current Month: ",(currentDate.getMonth()+1).toString());
      this.itemsCollection.add({
        "pid": "",
        "status": "created",
        "images": this.postObj.images,
        "description": this.postObj.description,
        "author": firebase.auth().currentUser.uid,
        "tags": "",
        "rank": 0,
        "like": 0,
        "follow": [],
        "comments": [],
        "postDate": currentDate.getDate().toString(),
        "postMonth": (currentDate.getMonth()+1).toString(),
        "createAt": firebase.firestore.FieldValue.serverTimestamp(),
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        this.itemsCollection.doc(docRef.id).update({
          "pid": docRef.id,
          "status": "updated",
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .catch(error => console.log(error));
    }
    else
    {
      console.log("content is not match the rule");
    }
  }

  onSelect(event) {
    let reader = new FileReader();
    if(this.postObj.images == null)
    {
      this.postObj.images = [];
    }
    console.log("images: ", this.postObj);
    reader.onload = (event: any) => {
      this.postObj.images.push(event.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
  }
}
