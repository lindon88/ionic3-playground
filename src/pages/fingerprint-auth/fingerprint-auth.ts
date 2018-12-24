import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";

/**
 * Generated class for the FingerprintAuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fingerprint-auth',
  templateUrl: 'fingerprint-auth.html',
})
export class FingerprintAuthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public fingerprint: FingerprintAIO) {
  }

  ionViewDidLoad() {
    this.fingerAuth();
  }

  fingerAuth() {
    this.fingerprint.show({
      clientId: 'Cover',
      clientSecret: 'coverAppPassDemo',
    }).then((result: any) => {
      if(result.withFingerprint){
        this.navCtrl.setRoot('HomePage');
      } else {
        alert('Error');
      }
    })
  }

  gotoPin() {
    this.navCtrl.setRoot('PinConfirmPage');
  }

}
