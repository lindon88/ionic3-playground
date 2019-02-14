import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAbsencePage } from './add-absence';

@NgModule({
  declarations: [
    AddAbsencePage,
  ],
  imports: [
    IonicPageModule.forChild(AddAbsencePage),
  ],
})
export class AddAbsencePageModule {}
