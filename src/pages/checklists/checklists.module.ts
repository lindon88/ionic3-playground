import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistsPage } from './checklists';

@NgModule({
  declarations: [
    ChecklistsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistsPage),
  ],
})
export class ChecklistsPageModule {}
