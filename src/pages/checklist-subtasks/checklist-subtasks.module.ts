import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistSubtasksPage } from './checklist-subtasks';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ChecklistSubtasksPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistSubtasksPage), PipesModule
  ],
})
export class ChecklistSubtasksPageModule {}
