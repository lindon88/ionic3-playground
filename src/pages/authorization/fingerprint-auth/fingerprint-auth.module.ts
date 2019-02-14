import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerprintAuthPage } from './fingerprint-auth';

@NgModule({
  declarations: [
    FingerprintAuthPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerprintAuthPage),
  ],
})
export class FingerprintAuthPageModule {}
