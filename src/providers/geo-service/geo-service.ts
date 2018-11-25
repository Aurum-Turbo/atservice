
import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the GeoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoServiceProvider {

  constructor(private geoLocation: Geolocation) {
    console.log('Hello GeoServiceProvider Provider');
  }

  geoInit() {
    this.geoLocation.getCurrentPosition().then(resp => {
      console.log("cur Latitude: ", resp.coords.latitude, "cur longtitude: ", resp.coords.longitude);
    }).catch(err => {console.log(err)});
  }

}
