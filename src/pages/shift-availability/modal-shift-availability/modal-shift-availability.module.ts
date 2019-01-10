import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalShiftAvailabilityPage } from './modal-shift-availability';

@NgModule({
  declarations: [
    ModalShiftAvailabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalShiftAvailabilityPage),
  ],
})
export class ModalShiftAvailabilityPageModule {}
