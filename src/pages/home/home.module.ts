import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {Test1Component} from "../../components/test1/test1";
import {Test2Component} from "../../components/test2/test2";

@NgModule({
  declarations: [
    HomePage, Test1Component, Test2Component
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage, Test1Component, Test2Component
  ]
})
export class HomePageModule {}
