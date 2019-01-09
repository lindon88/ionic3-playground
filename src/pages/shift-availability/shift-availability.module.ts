import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftAvailabilityPage } from './shift-availability';

@NgModule({
  declarations: [
    ShiftAvailabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(ShiftAvailabilityPage),
  ],
})
export class ShiftAvailabilityPageModule {}
