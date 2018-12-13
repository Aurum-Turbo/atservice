import { Injectable } from '@angular/core';

import { MessageData } from '../message-data/message-data';
/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserData {

  uid: string = "";
  type: string = ""; //Service Provider or User
  status: string = "";
  avatar: any;
  nickname: string = "";
  gender: string = "";
  birthday: string = "";
  location: any;
  brief: string = "";
  rate: number = 5; //the service level
  star: string[] = ["","icon-star","icon-star","icon-star","icon-star","icon-star"];

  constructor() {
    console.log('Hello UserDataProvider Provider');
  }

  setRate() {
    //let rating: number = 3.4; /* rating的值预设固定，拿到数据后可以自动显示 */
    console.log("rank: ",this.rate);
    //this.mark = rate;
    for (var i = 1; i <= 5; i++)
    {
      if(i <= Math.floor(this.rate))
        this.star[i] = "icon-star";
      else
      {
        if(i == Math.round(this.rate))
          this.star[i] = "icon-star-half";
        else
          this.star[i] =  "icon-star-outline";
      }
    //this.onEvent("onRates", index, e);
    };
    console.log("star: ", this.star);
  }

}
