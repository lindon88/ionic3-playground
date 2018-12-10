import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbsencePage } from './absence';
import {ModalDropAbsencePageModule} from "./modal-drop-absence/modal-drop-absence.module";

@NgModule({
  declarations: [
    AbsencePage,
  ],
  imports: [
    IonicPageModule.forChild(AbsencePage), ModalDropAbsencePageModule
  ],
})
export class AbsencePageModule {}
