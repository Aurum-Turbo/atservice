import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageData } from '../message-data/message-data';
import { UserData } from '../user-data/user-data';

/*
  Generated class for the ChatDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatData {


  cid: string = "";
  //ctime: any; //the latest message received time
  //ctitle: string = "";
  chatWith: UserData;
  chatOwner: UserData;
  members: string[];
  status: string = ""; //active inactive deleted
  //cmessageList: MessageData[];
  latestMesg: string = "";
  latestMesgSender: string = "";

  constructor() {
    //console.log('Hello ChatDataProvider Provider');
    //this.members = new Array<UserData>();
  }

}
