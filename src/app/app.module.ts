import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { JobPage } from '../pages/job/job';
import { ServicePage } from '../pages/service/service';
import { OrderPage } from '../pages/order/order';
import { EditorPage } from '../pages/editor/editor';
import { QuillModule } from 'ngx-quill';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { ServiceData } from '../providers/service-data/service-data';
import { OrderData } from '../providers/order-data/order-data';
import { OrderCreatorPage } from '../pages/order-creator/order-creator';
import { ServiceDetailsPage } from '../pages/service-details/service-details';
import { JobData } from '../providers/job-data/job-data';
import { AppSettings } from '../providers/app-setting';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    JobPage,
    ServicePage,
    OrderPage,
    EditorPage,
    OrderCreatorPage,
    ServiceDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    QuillModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    JobPage,
    ServicePage,
    OrderPage,
    EditorPage,
    OrderCreatorPage,
    ServiceDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataServiceProvider,
    ServiceData,
    OrderData,
    JobData,
    AuthServiceProvider
  ]
})
export class AppModule {}
