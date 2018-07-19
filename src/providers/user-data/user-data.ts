import { HttpClient } from '@angular/common/http';
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
  status: string = "";
  avatar: any;
  nickname: string = "";
  gender: string = "";
  birthday: string = "";
  geolocation: string = "";
  brief: string = "";
  messagebox: Array<MessageData>[];

  constructor(public http: HttpClient) {
    console.log('Hello UserDataProvider Provider');
  }

}
