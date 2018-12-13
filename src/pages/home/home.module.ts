import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxMasonryModule } from 'ngx-masonry';
import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    NgxMasonryModule
  ],
})
export class HomePageModule {}
