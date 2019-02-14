import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistSubtasksPage } from './checklist-subtasks';
import {PipesModule} from "../../../pipes/pipes.module";
import {ModalTaskNotePageModule} from "./modal-task-note/modal-task-note.module";

@NgModule({
  declarations: [
    ChecklistSubtasksPage
  ],
  imports: [
    IonicPageModule.forChild(ChecklistSubtasksPage), PipesModule, ModalTaskNotePageModule
  ],
})
export class ChecklistSubtasksPageModule {}
