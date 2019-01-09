import { Injectable } from '@angular/core';
import { ServiceData } from '../service-data/service-data';

/*
  Generated class for the OrderDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderData {

  oid: string = ""; //order id
  timestamp: Date;
  status: string = "";
  type: string = "";
  /* Info */
  service: ServiceData;
  /* Pricing */
  quantity: number = 0;
  subtotal: number = 0;
  servedate: string = "";
  servetime: string = "";
  servelocation: string = "";
  note: string = "";
  /* Parties */
  provideby: string = "";
  orderby: string = "";
  beneficiary: string = "";
  email: string = "";
  phone: string = "";
  /* for quote and search */
  //tags: any;
  createAt: any;
  updateAt: any;

  constructor() {
    //console.log('Hello OrderDataProvider Provider');
  }

}
