import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageData } from '../message-data/message-data';

/*
  Generated class for the ChatDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatData {


  cid: string = "";
  cntime: any;
  ctitle: string = "";
  cavatar: any;
  cnmessage: string = "";
  cstatus: string = ""; //active inactive deleted
  //cmessageList: MessageData[] = [];

  constructor() {
    console.log('Hello ChatDataProvider Provider');
  }

}
