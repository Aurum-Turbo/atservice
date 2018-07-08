import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ServiceDetailsPage } from '../service-details/service-details';
import { ServiceData } from '../../providers/service-data/service-data';
import { Camera, CameraOptions } from '@ionic-native/camera';


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
  /*
  public coverimage:any; //= "assets/icon/login.png";
  public title: any;
  public brief: any;
  public description: any;
  */
  public base64Image='';
  constructor(
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams, private camera: Camera) {

      if(navParams.data != null)
      {
        this.serviceObj = navParams.data; 
        console.log("edit page: ", this.serviceObj);
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
  }

  ionViewWillLeave() {
    //create service
    //this.serviceObj.coverimage = this.coverimage;
    console.log(this.serviceObj);
    this.dataService.updateServiceList("new",this.serviceObj);

  }

  onSelect(event) {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.serviceObj.coverimage = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }
  doCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
  // 跳转到service页面
  goPreview(){
    this.navCtrl.push(ServiceDetailsPage)
  }
}
