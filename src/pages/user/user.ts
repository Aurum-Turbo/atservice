import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { EditorPage } from '../editor/editor';

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
  
  public transList= [];
  public posList = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for(let i=0; i<10; i++){
      this.transList.push('这是第'+i+'条数据')
      this.posList.push("assets/imgs/0"+i+".jpeg")
    };
    
  }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    this.getRank();
  }
  @ViewChild('pageSlider') pageSlider: Slides;
  tabs: any = '0';
  selectTab(index) {
    this.pageSlider.slideTo(index);
  }
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  }
  onClick(event: string) {
    if(event == "new")
    {
      this.navCtrl.push(EditorPage);
    }
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
  goProfile(){
    this.navCtrl.push(ProfilePage)
  }
  
}
