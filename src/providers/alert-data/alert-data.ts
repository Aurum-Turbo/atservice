import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../user-data/user-data';

/*
  Generated class for the AlertDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertData {

  aid: string = "";
  keys: string = ""; //to somebody + status
  fromuid: string = "";
  fromWho: UserData;
  type: string = "";
  message: string = "";
  response: string = "";


  constructor() {
    //console.log('Hello AlertDataProvider Provider');
  }

}
