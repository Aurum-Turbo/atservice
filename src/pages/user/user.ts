import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  public star: string[]=[];
  public mark: number;
  tabs: any = '0';
  public transList= [];
  @ViewChild('pageSlider') pageSlider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for(let i=0; i<10; i++){
      this.transList.push('这是第'+i+'条数据')
    }
    
  }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    this.getRank();
  }
  selectTab(index) {
    this.pageSlider.slideTo(index);
     };

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
  goProfile(){
    this.navCtrl.push(ProfilePage)
  }
  
}
