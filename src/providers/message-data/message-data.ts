import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../user-data/user-data';

/*
  Generated class for the MessageDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageData {

  //define message fields
  mid: string = "";
  cid: string = ""; //chat id
  sender: UserData;
  //senderid: string = "";
  message: string = "";
  status: string = "";

  constructor() {
    console.log('Hello MessageDataProvider Provider');
  }

}
