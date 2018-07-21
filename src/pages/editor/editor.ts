import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ServiceData } from '../../providers/service-data/service-data';

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
  //public imgsList: any = [];

  constructor(
    public dataService: DataServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {

      if(navParams.data != null)
      {
        this.serviceObj = navParams.data; 
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
    console.log(this.serviceObj);
    this.dataService.updateServiceList("new",this.serviceObj);

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
  }

}
