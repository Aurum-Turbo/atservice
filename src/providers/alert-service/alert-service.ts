import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HomePage } from '../../pages/home/home';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertServiceProvider {
  title:string;
  subtitle:string;
  message:string;
  texts:string;
  alert:any;
  constructor( 
    public http: HttpClient, 
    private alertCtrl: AlertController, ) {
 
  }
/*   presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  } */
  
 
  
/*   presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (User.isValid(data.username, data.password)) {
              // logged in!
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  } */
  exitApp(){
    
  }
  
}
