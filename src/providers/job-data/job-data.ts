import { Injectable } from '@angular/core';
import { OrderData } from '../order-data/order-data';

/*
  Generated class for the JobDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JobData {

  jid: string; //Job ID 
  timestamp: Date; 
  status: string;
  order: OrderData;
  acceptedby: string;
  createAt: any;
  updateAt: any;
  
  constructor() {
    //console.log('Hello JobDataProvider Provider');
  }

}
