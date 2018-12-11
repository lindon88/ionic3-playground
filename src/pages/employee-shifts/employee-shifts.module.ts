import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeShiftsPage } from './employee-shifts';
import {ComponentsModule} from "../../components/components.module";
import { CalendarModule} from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    EmployeeShiftsPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeShiftsPage), ComponentsModule, CalendarModule
  ],
})
export class EmployeeShiftsPageModule {}
