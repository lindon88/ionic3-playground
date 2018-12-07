import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEosErrorPage } from './modal-eos-error';

@NgModule({
  declarations: [
    ModalEosErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEosErrorPage),
  ],
})
export class ModalEosErrorPageModule {}
