import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEosCancelPage } from './modal-eos-cancel';

@NgModule({
  declarations: [
    ModalEosCancelPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEosCancelPage),
  ],
})
export class ModalEosCancelPageModule {}
