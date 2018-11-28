import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistSubtasksPage } from './checklist-subtasks';
import {PipesModule} from "../../pipes/pipes.module";
import {ChecklistSubtasksPopoverPageModule} from "../checklist-subtasks-popover/checklist-subtasks-popover.module";

@NgModule({
  declarations: [
    ChecklistSubtasksPage
  ],
  imports: [
    IonicPageModule.forChild(ChecklistSubtasksPage), PipesModule, ChecklistSubtasksPopoverPageModule
  ],
})
export class ChecklistSubtasksPageModule {}
