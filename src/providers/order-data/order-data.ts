import { Injectable } from '@angular/core';
import { ServiceData } from '../service-data/service-data';

/*
  Generated class for the OrderDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderData {

  oid: string; //order id
  timestamp: string;
  status: string;
  type: string;
  /* Info */
  service: ServiceData;
  /* Pricing */
  quantity: string;
  subtotal: string;
  servedate: string;
  servetime: string;
  servelocation: string;
  note: string;
  /* Parties */
  orderby: any;
  beneficiary: any;
  email: string;
  phone: string;
  /* for quote and search */
  tags: string[];

  constructor() {
    //console.log('Hello OrderDataProvider Provider');
  }

}
