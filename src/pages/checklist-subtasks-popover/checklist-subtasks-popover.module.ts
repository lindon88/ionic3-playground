import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistSubtasksPopoverPage } from './checklist-subtasks-popover';

@NgModule({
  declarations: [
    ChecklistSubtasksPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistSubtasksPopoverPage),
  ],
  entryComponents: [ChecklistSubtasksPopoverPage]
})
export class ChecklistSubtasksPopoverPageModule {}
