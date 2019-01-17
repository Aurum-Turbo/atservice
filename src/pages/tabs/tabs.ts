import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

import { HomePage} from '../home/home';
import { LoginPage } from '../login/login';
import { UserPage } from '../user/user';
import { ChatPage } from '../chat/chat';
import { ServiceDetailsPage } from '../service-details/service-details';
import { AlertController, ToastController } from 'ionic-angular';

import { AlertData } from '../../providers/alert-data/alert-data';
import { UserData } from '../../providers/user-data/user-data';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import firebase from 'firebase/app';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = ChatPage;
  tab3Root: any = UserPage;
  mySelectedIndex: number;

  alertCollection: AngularFirestoreCollection<AlertData>;
  alertItems: Observable<AlertData[]>;

  constructor(
    private afs: AngularFirestore,
    private alertService: AlertServiceProvider,
    private loginService: LoginServiceProvider,
    //public localStorage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;

    //this.alertCollection = this.afs.collection('alerts');
    //this.alertItems = this.alertCollection.valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  ionViewWillEnter() {

    this.loginService.isUserLogined().then(result => {
      if(result)
      {
        this.alertCollection = this.afs.collection('alerts', ref => {
          return ref.where("keys", "==", firebase.auth().currentUser.uid + "_unread");
        });

        this.alertCollection.valueChanges().subscribe(alerts => {
          alerts.forEach(alert => {
            if(alert.type == "RATE")
            {
              this.alertService.presentPrompt(alert);
            }
          });
        });

      }
    });
  }

}
