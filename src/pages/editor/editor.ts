import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { PostData } from '../../providers/post-data/post-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data/user-data';

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
  
  postObj: PostData;

  calltype = "creating";

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection

  //for image upload
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: string;
  
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

      this.itemsCollection = this.afs.collection("posts");
      if(navParams.data != null)
      {
        this.postObj = navParams.get("post"); 

        if(this.postObj.pid)
        {
          this.calltype = "editing";
        }
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
    this.dataService.loadCurUserData();
  }

  ionViewWillLeave() {
    //create service
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
        "author":this.dataService.userDataObj.uid,
        "nickname": this.dataService.userDataObj.nickname,
        "avatar": this.dataService.userDataObj.avatar,
        "tags": "",
        "rank": 0,
        "likeList": [],
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

    if(this.calltype == "editing" && this.postObj.images != [] && this.postObj.description != null)
    {
      this.itemsCollection.doc(this.postObj.pid).update({
        "status": "updated",
        "images": this.postObj.images,
        "description": this.postObj.description,
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
      });
    }
  }

  onSelect(event) {
    const file = event.target.files[0];
    const path = `${firebase.auth().currentUser.uid}/images/${new Date().getTime()}_${file.name}`;

    if(this.postObj.images == null)
    {
      this.postObj.images = [];
    }

    if(this.postObj.images.length < 6)
    {
      this.ref = this.afStorage.ref(path);
      this.task = this.afStorage.upload(path, event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();

      this.task.task.then(snapshot => {
        if(snapshot.state == "success")
        {
          this.ref.getDownloadURL().subscribe(
            snapshot => {this.postObj.images.push(snapshot);}
          );
        }
      });
    }
    else
    {
      console.log("image number is exceeded the limitation (6)");
    }
  }

  onClick(event:string, item: any) {
    if(event == "discardImage" && item)
    {
      var index = this.postObj.images.indexOf(item);
      //delete the URL in the images
      if(index > -1)
      {
        this.postObj.images.splice(index,1);
      }

      this.afStorage.ref(item).delete().subscribe(result => { //delete the image in fire storage

        this.itemsCollection.doc(this.postObj.pid).update({
          "status": "updated",
          "images": this.postObj.images,
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
        })
        .catch(err => {console.log(err);});
      });
    }

    if(event == "discard" && item)
    {
      this.itemsCollection.doc(this.postObj.pid).delete().then(result => {
        console.log("delete success");
        this.calltype ="deleting";
        this.navCtrl.pop();
      })
      .catch(err => {console.log(err);});
    }

  }
}
