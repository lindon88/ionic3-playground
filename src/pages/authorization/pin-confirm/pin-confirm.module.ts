import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinConfirmPage } from './pin-confirm';

@NgModule({
  declarations: [
    PinConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(PinConfirmPage),
  ],
})
export class PinConfirmPageModule {}
