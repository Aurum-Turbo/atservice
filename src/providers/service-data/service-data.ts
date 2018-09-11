import { Injectable } from '@angular/core';

/*
  Generated class for the ServiceDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class ServiceData {

  sid: string = ""; //service id
  status: string = ""; //created, submitted, activated, suspended, discard 
  type: string = ""; // classified by qualification, transport, escorts
  //images: string[];
  description: string = ""; //description will be display on the service details
  duration: string = ""; //service duration from task proceeded to completed
  declaimer: string = "";
  provider: string = "";
  unit: string = ""; //单位
  price: string = "";
  currency: string = "";
  location: string = "";
  availability: boolean = true;
  /* Social Media*/
  tags: string = ""; //for searching
  rank: number = 0; // rank = rate + like + length of comments + timestamp
  like: number = 0; //thumb up for the service

  constructor() {
    //console.log('Hello Service Data Model');
  }

}
