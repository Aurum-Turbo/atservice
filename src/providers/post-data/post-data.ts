import { Injectable } from '@angular/core';
import { UserData } from '../user-data/user-data';

/*
  Generated class for the PostDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostData {

  pid: string = ""; //service id
  status: string = ""; //created, submitted, activated, suspended, discard 
  images: string[];
  description: string = ""; //description will be display on the service details
  author: string = "";
  nickname: string = "";
  coverWidth: number = 0;
  coverHeight: number = 0;
  avatar: any;
  /* Social Media*/
  tags: string = ""; //for searching
  rank: number = 0; // rank = rate + like + length of comments + timestamp
  likeList: string[]; //thumb up for the service
  like: number = 0;
  follow: string[];
  comments: any[];
  postDate: string = "";
  postMonth: string = "";
  createAt: any;
  updateAt: any;

  constructor() {
    console.log('Hello PostDataProvider Provider');
  }

}
