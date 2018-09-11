import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceCreatorPage } from './service-creator';

@NgModule({
  declarations: [
    ServiceCreatorPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceCreatorPage),
  ],
})
export class ServiceCreatorPageModule {}
