
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Geolocation } from '@ionic-native/geolocation';

import { AppSettings } from '../../providers/app-setting';
import * as firebase from 'firebase/app';

//import { google } from 'google-maps';
//import { GeoPoint } from '@firebase/firestore-types';

import * as geofirex from 'geofirex';
//import { GeoPoint } from '@firebase/firestore-types';

/*import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  HtmlInfoWindow,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Environment,
  LatLng
} from '@ionic-native/google-maps';
*/

/*
  Generated class for the GeoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


declare var google;
@Injectable()
export class GeoServiceProvider {
  public geo = geofirex.init(firebase);
  public curLocation: geofirex.GeoFirePoint;
  url = "https://maps.googleapis.com/maps/api/js?key=" + AppSettings.MAP_KEY.apiKey + "&callback=__onGoogleLoaded";
  geocoder;

  constructor(
    //private nativeGeocoder: NativeGeocoder,
    private geoLocation: Geolocation) {
    console.log('Hello GeoServiceProvider Provider');
  }

  public load() {
    return new Promise(resolve => {
    // Set callback for when google maps is loaded.
    window['__onGoogleLoaded'] = (ev) => {
    this.geocoder = new google.maps.Geocoder();
    console.log('google maps api loaded');
    resolve(true);
    };
    
    let node = document.createElement('script');
    node.src = this.url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  async geoCurLocation() {
    return new Promise(resolve => {
      this.geoLocation.getCurrentPosition().then(resp => {
        console.log("cur Latitude: ", resp.coords.latitude, "cur longtitude: ", resp.coords.longitude);
        this.curLocation = this.geo.point(resp.coords.latitude, resp.coords.longitude);
        resolve(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude));
      })
      .catch(err => {console.log(err);});
    })
    .catch(err => {console.log(err);});
  }

  async posToAddr(pos: geofirex.GeoFirePoint){
    return new Promise((resolve, reject) => {
      if (pos && this.geocoder) {
        this.geocoder.geocode({
          "location": {"lat": pos.latitude, "lng": pos.longitude}
        }, function (results) {
          if (Array.isArray(results) && results.length > 0) {
            let strAddress = new Array<string>();
            for(let item of results)
            {
              if(strAddress.indexOf(item.formatted_address) < 0 && strAddress.length < 5)
              {
                //console.log("results item: ", item.formatted_address, "list: ", strAddress);
                strAddress.push(item.formatted_address);
              }
            }
            resolve(strAddress);
          }
        });
      }
    }) as Promise<string[]>;
  }
}
