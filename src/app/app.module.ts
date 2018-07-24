import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';
import { ProfilePage } from '../pages/profile/profile';
import { MessagePage } from '../pages/message/message';
import { JobPage } from '../pages/job/job';
import { ServicetypePage } from '../pages/servicetype/servicetype';
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
import { Calendar } from '@ionic-native/calendar';
import { MessageData } from '../providers/message-data/message-data';
import { UserData } from '../providers/user-data/user-data';
import { LoadingServiceProvider } from '../providers/loading-service/loading-service';
import { AppSettings } from '../providers/app-setting';
import { PostData } from '../providers/post-data/post-data';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    UserPage,
    ProfilePage,
    MessagePage,
    JobPage,
    ServicetypePage,
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
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(), //.enablePersistence() used for offline storage
    AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    UserPage,
    ProfilePage,
    MessagePage,
    JobPage,
    ServicetypePage,
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
    Calendar,
    MessageData,
    UserData,
    LoadingServiceProvider,
    PostData
  ]
})
export class AppModule {}
