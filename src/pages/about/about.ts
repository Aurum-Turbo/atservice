import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
import { ServiceData } from '../../providers/service-data/service-data';
/* import { ServiceData } from '../../providers/service-data/service-data';
import{ ServicePage } from '../service/service'; */

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  public tabs: string= 'blance';
  public data: any;
  public star: string[] = [];
  public mark: number;
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    this.getRank();
  }
  getRank() {
    let rating: number = 3.4; /* rating的值预设固定，拿到数据后可以自动显示 */
    console.log("rank: ",rating);
    this.mark = rating;
    for (var i = 1; i <= 5; i++)
    {
      if(i <= Math.floor(rating))
        this.star[i] = "icon-star";
      else
      {
        if(i == Math.round(rating))
          this.star[i] = "icon-star-half";
        else
          this.star[i] =  "icon-star-outline";
      }
    //this.onEvent("onRates", index, e);
    };
    console.log("star: ", this.star);
  }
  onClick(event: string, item: ServiceData) {
    if(event == "new")
    {
      this.navCtrl.push(EditorPage);
    }
  }
}
