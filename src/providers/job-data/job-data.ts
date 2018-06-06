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
  timestamp: string; 
  status: string;
  order: OrderData;
  
  constructor() {
    //console.log('Hello JobDataProvider Provider');
  }

}
