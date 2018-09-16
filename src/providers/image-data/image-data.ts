import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ImageDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageData {

  iid: string = "";
  url: string = "";
  imgsrc: string = "";
  remotePath: string = "";
  hwratio: number = 0;
  preloadwidth: number = 0;
  preloadheight: number = 0;

  constructor() {
    console.log('Hello ImageDataProvider Provider');
  }

}
