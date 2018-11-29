import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistFilterPopoverPage } from './checklist-filter-popover';

@NgModule({
  declarations: [
    ChecklistFilterPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistFilterPopoverPage),
  ],
})
export class ChecklistFilterPopoverPageModule {}
