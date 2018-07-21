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
  images: string[];
  title: string = ""; //title will display on the service list.
  brief: string = ""; //brief will display on the service list.
  description: string = ""; //description will be display on the service details
  provider: any = "";
  duration: string = ""; //service duration from task proceeded to completed
  unit: string = ""; //单位
  price: string = "";
  currency: string = "";
  declaimer: string = "";
  location: string = "";
  availability: {
       time: [{}],
      };
  /* Social Media*/
  tags: string = ""; //for searching
  rank: number = 0; // rank = rate + like + length of comments + timestamp
  rate: number = 0; //the service level
  like: number = 0; //thumb up for the service
  comments: any[];

  constructor() {
    //console.log('Hello Service Data Model');
  }

}
