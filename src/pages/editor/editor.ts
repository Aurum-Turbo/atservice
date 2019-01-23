import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PostData } from '../../providers/post-data/post-data';
import { ImageData } from '../../providers/image-data/image-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data/user-data';
import { GeoServiceProvider } from '../../providers/geo-service/geo-service';
//import { GESTURE_PRIORITY_TOGGLE } from 'ionic-angular/umd/gestures/gesture-controller';

//import { QuillModule } from 'ngx-quill';
import geofirex from 'geofirex';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

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
  currentUser: UserData;

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

  disableBtns: boolean = true;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private geoService: GeoServiceProvider,
    private alertService: AlertServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

    this.itemsCollection = this.afs.collection("posts");
    if (this.navParams.data != null) {
      this.postObj = this.navParams.get("post");

      if (this.postObj.pid) {
        this.calltype = "editing";
        this.disableBtns = false;
      }

      this.currentUser = this.navParams.get("user");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
    //this.dataService.loadCurUserData();
  }

  ionViewWillLeave() {

    //build up the post
    //update the database
    //this.disableBtns = true;
    if (this.postObj.images.length < 0) {
      this.alertService.presentToast("[Info]: Post will not be saved because there's no image");
    }
    else 
    {
      if (this.postObj.description.length <= 0 || this.postObj.description.length > 2000) {
        this.alertService.presentToast("[Info]: Post will not be saved because the description extend the limitation (20 - 2000 Characters)");
      }
      else {
        if (this.calltype == "creating") {
          var currentDate = new Date();
          this.itemsCollection.add({
            "pid": "",
            "status": "created",
            "images": this.postObj.images,
            "imgHeights": this.postObj.imgHeights,
            "description": this.postObj.description,
            "author": this.currentUser.uid,
            "nickname": this.currentUser.nickname,
            "avatar": this.currentUser.avatar,
            "tags": "",
            "rank": 0,
            "likeList": [],
            "like": 0,
            "follow": [],
            "comments": [],
            "postLocation": this.geoService.curLocation.data,
            "postDate": currentDate.getDate().toString(),
            "postMonth": (currentDate.getMonth() + 1).toString(),
            "createAt": firebase.firestore.FieldValue.serverTimestamp(),
            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
          })
            .then(docRef => {
              this.postObj.pid = docRef.id;
              this.itemsCollection.doc(docRef.id).update({
                "pid": docRef.id,
                "status": "updated",
                "updateAt": firebase.firestore.FieldValue.serverTimestamp()
              });
              //upload all images
              if (this.postObj.pid != "" && this.postObj.images.length > 0) {
                //console.log("upload Image number: ", this.postObj.images.length);

                this.postObj.images.forEach(image => {
                  if (!image.includes("https")) {
                    var remotePath = firebase.auth().currentUser.uid + "/images/" + (new Date()).getTime();
                    this.afStorage.ref(remotePath).putString(image, 'data_url')
                      .then(snapshot => {
                        if (snapshot.state == "success") {
                          snapshot.ref.getDownloadURL().then(
                            remoteURL => {
                              var imgIndex = this.postObj.images.indexOf(image);
                              this.postObj.images[imgIndex] = remoteURL;
                              //console.log("imgIndex: ", imgIndex, " URL: ", remoteURL);

                              //update database once complete the upload
                              this.itemsCollection.doc(this.postObj.pid).update({
                                "pid": docRef.id,
                                "status": "updated",
                                "images": this.postObj.images,
                                "updateAt": firebase.firestore.FieldValue.serverTimestamp()
                              })
                                .then(result => {
                                  this.alertService.presentToast("[Info]: Post Upload Successfully!");
                                })
                                .catch(err => { console.log(err) });
                            })
                            .catch(err => { console.log(err) });
                        }
                      })
                      .catch(err => { console.log(err); });
                  }
                });
                // this.navCtrl.pop();
              }
            })
            .catch(error => console.log(error));
        }

        if (this.calltype == "editing") {
          //upload all images
          if (this.postObj.pid != "" && this.postObj.images.length > 0) {
            //console.log("upload Image number: ", this.postObj.images.length);
            this.postObj.images.forEach(image => {
              if (!image.includes("https")) {
                var remotePath = firebase.auth().currentUser.uid + "/images/" + (new Date()).getTime();
                this.afStorage.ref(remotePath).putString(image, 'data_url')  //.upload(item.remotePath, item.localFile);
                  .then(snapshot => {
                    if (snapshot.state == "success") {
                      snapshot.ref.getDownloadURL().then(
                        remoteURL => {
                          var imgIndex = this.postObj.images.indexOf(image);
                          this.postObj.images[imgIndex] = remoteURL;
                          //update database once complete the upload
                          this.itemsCollection.doc(this.postObj.pid).update({
                            "status": "updated",
                            "images": this.postObj.images,
                            "imgHeights": this.postObj.imgHeights,
                            "description": this.postObj.description,
                            "updateAt": firebase.firestore.FieldValue.serverTimestamp()
                          });
                        });
                    }
                  })
                  .catch(err => { console.log(err); });
              }
            });
          }
        }
      }
    }
  }

  onSelect(event) {
    if (this.postObj.images.length < 5) {
      const curFile = event.target.files[0];
      if (curFile.size > 2000000) {
        this.alertService.presentToast("[WARN] The image size extend the limitation (2MB)");
      }
      else 
      {
        console.log("load image: ", curFile.name);
        //get image data
        var reader = new FileReader();
        var img = new Image();
        var that = this;

        reader.readAsDataURL(curFile);

        reader.onloadend = () => {
          img.src = reader.result.toString();

          img.onload = function () {
            //console.log("size: ", curFile.size, "rate: ", img.height + " / " + img.width);
            that.postObj.images.push(img.src);
            that.postObj.imgHeights.push(Math.round(190 / img.width * img.height));
            //that.uploadImageList.push(curImage);
          }
        };
      }

    }
    else {
      //console.log("image number is exceeded the limitation (6)");
      this.alertService.presentToast("[WARN] The number of images extend the limitation (5)");
    }
  }

  onClick(event: string, item: any) {
    if (event == "discardImage" && item) {
      var index = this.postObj.images.indexOf(item);
      //delete the URL in the images
      if (index > -1) {
        if (index == 0 && this.postObj.images.length == 1) {
          //console.log("at least one photo in the list");
          this.alertService.presentToast("[WARN] Post need at least one image attached!");
        }
        else 
        {
          this.postObj.images.splice(index, 1);
          this.postObj.imgHeights.splice(index, 1);

          //console.log("discard item: ", item);

          if (item.includes("https")) {
            this.afStorage.storage.refFromURL(item).delete().then(result => { //delete the image in fire storage
              this.itemsCollection.doc(this.postObj.pid).update({
                "status": "updated",
                "images": this.postObj.images,
                "imgHeights": this.postObj.imgHeights,
                "updateAt": firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(result => {
                this.alertService.presentToast("[INFO] Discard one image for the list");
              })
                .catch(err => { console.log(err); });
            })
              .catch(err => { console.log(err); });
          }
        }
      }
    }

    if (event == "discard") {
      this.disableBtns = true;
      //delete all images first
      if (this.postObj.images.length > 0 && this.postObj.description != null) {
        this.postObj.images.forEach(image => {
          if (image.includes("https")) {
            this.afStorage.storage.refFromURL(image).delete().then(result => {
            })
              .catch(err => { console.log(err); });
          }
        });

        this.itemsCollection.doc(this.postObj.pid).delete().then(result => {
          console.log("delete success");
          this.calltype = "deleting";
          this.navCtrl.pop();
        })
          .catch(err => { console.log(err); });
      }
      else {
        this.navCtrl.pop();
      }
    }
  }
}
