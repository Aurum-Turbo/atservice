import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ServiceData } from '../../providers/service-data/service-data';

import firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
  
  serviceObj = new ServiceData();
  calltype = "creating";

  /*
  public coverimage:any; //= "assets/icon/login.png";
  public title: any;
  public brief: any;
  public description: any;
  */
  //public imgsList: any = [];

  constructor(
    private afs: AngularFirestore,
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      
      if(navParams.data != null)
      {
        this.serviceObj = navParams.data; 
        this.calltype = "editing";
        console.log("edit page: ", this.serviceObj);
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
    if(this.calltype == "creating" && this.serviceObj.images != [] && this.serviceObj.description != null)
    { 
      //this.dataService.updateServiceList("new",this.serviceObj);
      this.afs.collection("services").add({
        "status": "created",
        "type": "",
        "images": this.serviceObj.images,
        "description": this.serviceObj.description,
        "provider": firebase.auth().currentUser.uid
      });
    }
    else
    {
      console.log("content is not match the rule");
    }
  }

  onSelect(event) {
    let reader = new FileReader();
    if(this.serviceObj.images == null)
    {
      this.serviceObj.images = [];
    }
    console.log("images: ", this.serviceObj);
    reader.onload = (event: any) => {
      this.serviceObj.images.push(event.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  onClick(event) {
    console.log("event = ", event);
    if(event == "submit")
    {
      console.log("editor.onClick: ", this.serviceObj);
      if(this.serviceObj.images != [] && this.serviceObj.description != null)
      { 
        //this.dataService.updateServiceList("new",this.serviceObj);
        this.afs.collection("services").add(this.serviceObj);
      }
      else
      {
        console.log("content is not match the rule");
      }
    }
  }

}
