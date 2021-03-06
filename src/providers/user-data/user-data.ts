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
  //star: string[] = ["","icon-star","icon-star","icon-star","icon-star","icon-star"];

  constructor() {
    console.log('Hello UserDataProvider Provider');
  }

}
