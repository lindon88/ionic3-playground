import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageDetailsPage } from './message-details';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MessageDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageDetailsPage), PipesModule
  ],
})
export class MessageDetailsPageModule {}
