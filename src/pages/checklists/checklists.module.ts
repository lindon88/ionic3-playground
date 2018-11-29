import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistsPage } from './checklists';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {PipesModule} from "../../pipes/pipes.module";
import {ChecklistFilterPopoverPageModule} from "../checklist-filter-popover/checklist-filter-popover.module";

@NgModule({
  declarations: [
    ChecklistsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistsPage), RoundProgressModule, PipesModule, ChecklistFilterPopoverPageModule
  ],
})
export class ChecklistsPageModule {}
