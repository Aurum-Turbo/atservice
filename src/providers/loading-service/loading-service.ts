import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingServiceProvider {

  loading: any;


  constructor(private loadingCtrl: LoadingController) {
    console.log('Hello LoadingServiceProvider Provider');
  }

 
}
