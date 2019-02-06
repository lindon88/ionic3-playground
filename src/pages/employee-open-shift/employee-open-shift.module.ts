import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeOpenShiftPage } from './employee-open-shift';
import {ComponentsModule} from "../../components/components.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    EmployeeOpenShiftPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeOpenShiftPage), ComponentsModule, PipesModule
  ],
})
export class EmployeeOpenShiftPageModule {}
