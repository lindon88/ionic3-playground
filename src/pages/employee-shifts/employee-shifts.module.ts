import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeShiftsPage } from './employee-shifts';
import {ComponentsModule} from "../../components/components.module";
import { CalendarModule} from 'ionic3-calendar-en';
import {ModalShiftPopupPageModule} from "./modal-shift-popup/modal-shift-popup.module";

@NgModule({
  declarations: [
    EmployeeShiftsPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeShiftsPage), ComponentsModule, CalendarModule, ModalShiftPopupPageModule
  ],
})
export class EmployeeShiftsPageModule {}
