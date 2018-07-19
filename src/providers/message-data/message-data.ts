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
  time: string = "";
  sender: string = "";
  receiver: string = "";
  message: string = "";
  lifetime: string = "";

  constructor(public http: HttpClient) {
    console.log('Hello MessageDataProvider Provider');
  }

}
