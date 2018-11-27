import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistsPage } from './checklists';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    ChecklistsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistsPage), RoundProgressModule
  ],
})
export class ChecklistsPageModule {}
