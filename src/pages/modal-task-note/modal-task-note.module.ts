import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTaskNotePage } from './modal-task-note';

@NgModule({
  declarations: [
    ModalTaskNotePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTaskNotePage),
  ],
})
export class ModalTaskNotePageModule {}
