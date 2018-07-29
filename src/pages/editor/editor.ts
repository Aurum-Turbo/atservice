import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { PostData } from '../../providers/post-data/post-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Timestamp } from '../../../node_modules/rxjs';
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
  userObj: UserData;

  calltype = "creating";

  itemsCollection: AngularFirestoreCollection<PostData>; //Firestore collection
  itemDocument: AngularFirestoreDocument<PostData>; // read collection

  //for image upload
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

      this.itemsCollection = this.afs.collection("posts");


      
      if(navParams.data != null)
      {
        this.postObj = navParams.get("post"); 
        this.userObj = navParams.get("user");

        if(this.postObj.pid)
        {
          this.calltype = "editing";
        }
        //console.log("edit page: ", this.postObj);
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
        "author":this.userObj.uid,
        "nickname": this.userObj.nickname,
        "avatar": this.userObj.avatar,
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
        "status": "created",
        "images": this.postObj.images,
        "description": this.postObj.description,
        "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
      });
    }
  }

  onSelect(event) {
    const file = event.item(0);
    let reader = new FileReader();

    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    reader.readAsDataURL(event.item(0));

    const path = `${firebase.auth().currentUser.uid}/images/${new Date().getTime()}_${file.name}`;
    this.ref = this.afStorage.ref(path);
    //this.task = this.afStorage.upload(path, file);
    //this.uploadProgress = this.task.percentageChanges();
    //this.task.snapshotChanges().subscribe(snapshot => {this.downloadURL = this.ref.getDownloadURL();});
    var uploadTask = firebase.storage().ref(path).put(file);

    uploadTask.on('state_changed', snapshot => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    }, err => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (err.code) {
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;
        case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
      }
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadurl => {
        console.log("file download Url: ", downloadurl);
      }); 
    });




    /*
    let reader = new FileReader();
    
    if(reader)
    {
      //console.log("images: ", this.postObj);
      reader.onload = (event: any) => {
        const id = Math.random().toString(36).substring(2);
      this.ref = this.afStorage.ref(firebase.auth().currentUser.uid + "/images/"+ id);
      this.task = this.ref.put(event.target.files[0]);
      
      this.downloadURL = this.ref.getDownloadURL();
      this.downloadURL.subscribe(observer => {this.postObj.images.push(observer.toString());});
      
      }
      reader.readAsDataURL(event.target.files[0]);
    }*/
  }
}
