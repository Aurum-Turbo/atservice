import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase/app';

import { ServiceData } from '../service-data/service-data';
import { OrderData } from '../order-data/order-data';
import { JobData } from '../job-data/job-data';

import 'uuid';
import { AppSettings } from '../app-setting';
declare var require: any

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DataServiceProvider {

  serviceList = [];
  orderList = [];
  jobList = [];
  sortedJobList = [];

  constructor(
    private afs: AngularFirestore,
    private localStorage: Storage,
    public http: HttpClient) {
    console.log('Hello DataServiceProvider Provider');
    //load service list from localstorage
    this.localStorage.get('servicelist').then(record => {
      if(record)
      {
        this.serviceList = record;
      }
    }, err => {console.log(err)});
  }

  load() {
    this.localStorage.get('servicelist').then(snapshot => {
      if(snapshot)
      {
        this.serviceList = snapshot;
      }
      else
      {
        if(AppSettings.IS_FIREBASE_ENABLED)
        {
          this.afs.collection('services').ref.where("provider", "==", firebase.auth().currentUser.uid)
          .get()
          .then(querysnapshot => {
            querysnapshot.forEach(item => {
              this.serviceList.push(item);
            });
          });
          this.localStorage.set("servicelist",this.serviceList);
        }
      }
    }, err => {console.log(err)});

    this.localStorage.get('orderlist').then(snapshot => {
      if(snapshot)
      {
        this.orderList = snapshot;
      }
    }, err => {console.log(err)});

    this.localStorage.get('joblist').then(snapshot => {
      if(snapshot)
      {
        this.jobList = snapshot;
      }
    }, err => {console.log(err)});
  }

  isLogin(): boolean {
    var loginStatus = false;
    this.localStorage.get('loginstatus').then(status => {
      if(status)
      {
        loginStatus = status;
        console.log("loginstatus: ", loginStatus);
      }
    });

    return loginStatus;
  }

  setLogin() {
    this.localStorage.set('loginstatus',true);
  }

  getServiceByID(sid: string): ServiceData {
    console.log("get Service By ID: ", this.serviceList.length);
    var serviceByID = null;
    for(var index = 0; index < this.serviceList.length; index++)
    {
      //console.log("find the according sid: ", index);
      if(this.serviceList[index].sid == sid)
      {
        serviceByID = this.serviceList[index];
      }
    }

    return serviceByID;
  } 

  updateServiceList(event:string, service: ServiceData) {
    if(this.serviceList.length >= 0)
    {
      if(!service.sid && event == "new")
      {
        //created new service
        const uuidv1 = require('uuid/v1');
        service.sid = uuidv1().toString();

        service.currency = "AUD";
        service.status = "created";
        service.rate = 5;
        service.like = 0;

        service.provider = firebase.auth().currentUser.uid;
        //console.log("time: ", new Date().getTime(), " like: ", service.like, " service.rate: ", service.rate);
        service.rank = (new Date().getUTCSeconds()) + (service.like) + (service.rate);

        this.serviceList.push(service);
        //update the fbs
        /*if(AppSettings.IS_FIREBASE_ENABLED)
        {
          this.afs.collection('services').doc(service.sid).set(service);
        }*/
      }
      else
      {
        for(var index = 0; index < this.serviceList.length; index++)
        {
          //console.log("find the according sid: ", index);
          if(this.serviceList[index].sid == service.sid)
          {
            if(event == "discard")
            {
              this.serviceList.splice(index,1);
              console.log("success delete service at index: ", index);
              if(AppSettings.IS_FIREBASE_ENABLED)
              {
                this.afs.collection('services').doc(service.sid).delete();
              }
            }

            if(event == "update")
            {
              service.rank = (new Date().getTime()) + (service.like) + (service.rate);
              this.serviceList.splice(index, 1, service);
              //update fbs
              if(AppSettings.IS_FIREBASE_ENABLED)
              {
                //console.log("time: ", new Date().getTime(), " like: ", service.like, " service.rate: ", service.rate);
                this.afs.collection('services').doc('service.sid').ref.get().then(doc => {
                  if(doc.exists)
                  {
                    this.afs.collection('services').doc(service.sid).update(service);
                    console.log("afs update the record");
                  }
                  else
                  {
                    this.afs.collection('services').doc(service.sid).set(service);
                    console.log("afs add a record");
                  }
                }); 
              }
            }
            break;
          }
        };
      }

      console.log("serviceList snapshot: ", this.serviceList);

      //save servicelist into localstorage
      this.localStorage.set('servicelist',this.serviceList).then(() => {
        console.log("save to db success", this.serviceList);
      });
    }
    else
    {
      console.log("service list is invalid");
    }
  }

  updateOrderList(event:string, order: OrderData) {
    if(this.orderList.length >= 0)
    {
      if(!order.oid)
      {
        //created new order
        const uuidv1 = require('uuid/v1');
        order.oid = uuidv1().toString();
        order.status = "created";
        this.orderList.push(order);
      }
      else
      {
        for(var index = 0; index < this.orderList.length; index++)
        {
          //console.log("find the according sid: ", index);
          if(this.orderList[index].oid == order.oid)
          {
            if(event == "discard")
            {
              this.orderList.splice(index,1);
              console.log("success delete service at index: ", index);
            }

            if(event == "update")
            {
              this.orderList.splice(index, 1, order);
            }
            break;
          }
        };
      }
 
      console.log("orderList snapshot: ", this.orderList);

      //save servicelist into localstorage
      this.localStorage.set('orderlist',this.orderList).then(() => {
        console.log("save to db success", this.orderList);
      });
    }
    else
    {
      console.log("order list is invalid");
    }
  }

  updateJobList(event:string, job: JobData) {
    if(this.jobList.length >= 0)
    {
      if(!job.jid)
      {
        //created new order
        const uuidv1 = require('uuid/v1');
        job.jid = uuidv1().toString();
        job.status = "created";
        this.jobList.push(job);

        //sort data by date and time
        this.jobList.sort(((a,b) => a.order.servedate <= b.order.servedate ? -1:1));
        console.log("jobList sorted snapshot: ", this.jobList);
      }
      else
      {
        for(var index = 0; index < this.jobList.length; index++)
        {
          //console.log("find the according sid: ", index);
          if(this.jobList[index].jid == job.jid)
          {
            if(event == "discard")
            {
              this.jobList.splice(index,1);
              console.log("success delete service at index: ", index);
            }

            if(event == "ready")
            {
              job.status = "ready";
              this.jobList.splice(index, 1, job);
            }

            if(event == "proceed")
            {
              job.status = "proceed";
              this.jobList.splice(index, 1, job);
            }

            if(event == "complete")
            {
              job.status = "complete";
              this.jobList.splice(index, 1, job);
            }
            break;
          }
        };
      }

      console.log("jobList snapshot: ", this.jobList);

      //save servicelist into localstorage
      this.localStorage.set('joblist',this.jobList).then(() => {
        console.log("save to db success", this.jobList);
      });
    }
    else
    {
      console.log("order list is invalid");
    }
  }

  /*
  fbsAdd(event: string, item: any) {
    if(event == "service")
    {
      this.afs.collection<ServiceData>('services').doc(item.sid).set(item);
    }

    if(event == "order")
    {
      this.afs.collection<OrderData>('orders').doc(item.oid).set(item);
    }

  }

  fbsUpdate(event: string, item: any) {
    if(event == "service")
    {
      this.afs.collection<ServiceData>('services').doc(item.sid).update(item);
    }

    if(event == "order")
    {
      this.afs.collection<OrderData>('orders').doc(item.oid).update(item);
    }

  }*/

}
