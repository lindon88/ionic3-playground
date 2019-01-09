import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayrollPage } from './payroll';

@NgModule({
  declarations: [
    PayrollPage,
  ],
  imports: [
    IonicPageModule.forChild(PayrollPage),
  ],
})
export class PayrollPageModule {}
