import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAbsenceNotePage } from './modal-absence-note';

@NgModule({
  declarations: [
    ModalAbsenceNotePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAbsenceNotePage),
  ],
})
export class ModalAbsenceNotePageModule {}
