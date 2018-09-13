import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { PostData } from '../../providers/post-data/post-data';
import { ImageData } from '../../providers/image-data/image-data';

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
  uploadImageList: ImageData[];

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
    this.uploadImageList = [];
  }

  onSelect(event) {
    var curImage = new ImageData();

    if(this.postObj.images == null)
    {
      this.postObj.images = [];
    }

    if(this.uploadImageList == null)
    {
      this.uploadImageList = [];
    }

    if(this.postObj.images.length < 6)
    {
      console.log("before add: ", this.postObj.images);
      curImage.localFile = event.target.files[0];
      curImage.remotePath = `${firebase.auth().currentUser.uid}/images/${new Date().getTime()}_${curImage.localFile.name}`;
      //get image data
      var reader = new FileReader();
      var img = new Image();
      var that = this;

      reader.readAsDataURL(curImage.localFile);

      reader.onloadend = () => {
        img.src = reader.result.toString();
        img.onload = function () {
          curImage = new ImageData();
          console.log(img.height + " / " + img.width);
          curImage.iid = curImage.remotePath;
          curImage.actualwidth = img.width;
          curImage.actualheight = img.height;
          curImage.hwratio = img.height/img.width;
          curImage.preloadwidth = 190;
          curImage.preloadheight = Math.round(curImage.preloadwidth*curImage.hwratio);
          curImage.size = img.sizes;
          curImage.imgsrc = img.src;
          curImage.createAt = new Date();
            
          console.log("cover height: ", curImage.preloadheight);

          that.postObj.images.push(curImage);
          that.uploadImageList.push(curImage);
        }
      }
    }
    else
    {
      console.log("image number is exceeded the limitation (6)");
    }

    console.log("after add: ", this.postObj.images);
  } 

  onClick(event:string, item: any) {
    if(event == "discardImage" && item)
    {
      var index = this.postObj.images.indexOf(item);
      //delete the URL in the images
      if(index > -1)
      {
        if(index == 0 && this.postObj.images.length == 1)
        {
          console.log("at least one photo in the list");
        }
        else
        {
          this.postObj.images.splice(index,1);

          console.log("discard item: ", item);
          this.afStorage.storage.refFromURL(item).delete().then(result => { //delete the image in fire storage
            this.itemsCollection.doc(this.postObj.pid).update({
              "status": "updated",
              "images": this.postObj.images,
              "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
            })
            .catch(err => {console.log(err);});
          })
          .catch(err => {console.log(err);});
        }
      }

      var uploadIndex = this.uploadImageList.indexOf(item);
      if(uploadIndex > -1)
      {
        this.uploadImageList.splice(index,1);
      }
    }

    if(event == "discard" && item)
    {
      item.images.forEach(image => {
        this.afStorage.storage.refFromURL(image).delete().then(result => {
          console.log("delete image: ", image);
        })
        .catch(err => {console.log(err);});
      });

      this.itemsCollection.doc(this.postObj.pid).delete().then(result => {
        console.log("delete success");
        this.calltype ="deleting";
        this.navCtrl.pop();
      })
      .catch(err => {console.log(err);});
    }

    if(event == "save" && item)
    {
      //upload all images
      if(this.uploadImageList.length > 0)
      {
        this.uploadImageList.forEach(item => {
          this.ref = this.afStorage.ref(item.remotePath);
          this.task = this.afStorage.upload(item.remotePath, item.localFile);
          this.uploadProgress = this.task.percentageChanges();
  
          this.task.task.then(snapshot => {
            if(snapshot.state == "success")
            {
              this.ref.getDownloadURL().subscribe(
                snapshot => {
                  item.url = snapshot;
                });
            }
          })
          .catch(err => {console.log(err);});
        });
      }
      

      //update the database
      if(this.calltype == "creating" && this.postObj.images.length > 0 && this.postObj.description != null)
      {
        var currentDate = new Date();
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
        console.log("cannot create the POST, content is not match the rule");
      }

      if(this.calltype == "editing" && this.postObj.images.length > 0 && this.postObj.description != null)
      {
        this.itemsCollection.doc(this.postObj.pid).update({
          "status": "updated",
          "images": this.postObj.images,
          "description": this.postObj.description,
          "updateAt": firebase.firestore.FieldValue.serverTimestamp()  
        });
      }

    }

  }
}
