import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCreatorPage } from './order-creator';

@NgModule({
  declarations: [
    //OrderCreatorPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCreatorPage),
  ],
})
export class OrderCreatorPageModule {}
