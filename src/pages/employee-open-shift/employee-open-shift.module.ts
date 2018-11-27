import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeOpenShiftPage } from './employee-open-shift';

@NgModule({
  declarations: [
    EmployeeOpenShiftPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeOpenShiftPage),
  ],
})
export class EmployeeOpenShiftPageModule {}
