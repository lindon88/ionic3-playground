import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistsPage } from './checklists';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {OrderPipe} from "../../pipes/order/order";

@NgModule({
  declarations: [
    ChecklistsPage, OrderPipe
  ],
  imports: [
    IonicPageModule.forChild(ChecklistsPage), RoundProgressModule
  ],
})
export class ChecklistsPageModule {}
