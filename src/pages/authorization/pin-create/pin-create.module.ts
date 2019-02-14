import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinCreatePage } from './pin-create';

@NgModule({
  declarations: [
    PinCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(PinCreatePage),
  ],
})
export class PinCreatePageModule {}
