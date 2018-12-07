import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEosSendPage } from './modal-eos-send';

@NgModule({
  declarations: [
    ModalEosSendPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEosSendPage),
  ],
})
export class ModalEosSendPageModule {}
