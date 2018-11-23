import { LandingPage } from './landing';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    IonicPageModule.forChild(LandingPage),
    LottieAnimationViewModule.forRoot()
  ],
  exports: [
    LandingPage
  ]
})

export class LandingPageModule { }
