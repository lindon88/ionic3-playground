import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeShiftsPage } from './employee-shifts';

@NgModule({
  declarations: [
    EmployeeShiftsPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeShiftsPage),
  ],
})
export class EmployeeShiftsPageModule {}
