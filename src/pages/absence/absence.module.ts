import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbsencePage } from './absence';

@NgModule({
  declarations: [
    AbsencePage,
  ],
  imports: [
    IonicPageModule.forChild(AbsencePage),
  ],
})
export class AbsencePageModule {}
