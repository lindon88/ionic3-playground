import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftAvailabilityPage } from './shift-availability';
import { ModalShiftAvailabilityPageModule } from "./modal-shift-availability/modal-shift-availability.module";

@NgModule({
  declarations: [
    ShiftAvailabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(ShiftAvailabilityPage), ModalShiftAvailabilityPageModule
  ],
})
export class ShiftAvailabilityPageModule {}
