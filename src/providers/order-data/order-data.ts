import { Injectable } from '@angular/core';
import { ServiceData } from '../service-data/service-data';
import { Timestamp } from 'rxjs';

/*
  Generated class for the OrderDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderData {

  oid: string; //order id
  timestamp: Date;
  status: string;
  type: string;
  /* Info */
  service: ServiceData;
  /* Pricing */
  quantity: number;
  subtotal: number;
  servedate: string;
  servetime: string;
  servelocation: string;
  note: string;
  /* Parties */
  provideby: string;
  orderby: string;
  beneficiary: any;
  email: string;
  phone: string;
  /* for quote and search */
  //tags: any;
  createAt: any;
  updateAt: any;

  constructor() {
    //console.log('Hello OrderDataProvider Provider');
  }

}
