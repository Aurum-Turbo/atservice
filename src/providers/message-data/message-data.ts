import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MessageDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageData {

  //define message fields
  mid: string = "";
  time: any;
  sender: string = "";
  snickname: string = "";
  savatar: any;
  receiver: string = "";
  message: string = "";
  status: string = "";

  constructor() {
    console.log('Hello MessageDataProvider Provider');
  }

}
