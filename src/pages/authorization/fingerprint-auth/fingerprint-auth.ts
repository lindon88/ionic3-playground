import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";

@IonicPage()
@Component({
  selector: 'page-fingerprint-auth',
  templateUrl: 'fingerprint-auth.html',
})
export class FingerprintAuthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public fingerprint: FingerprintAIO, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    // on page load, show finger auth dialog
    this.fingerAuth();
  }

  /**
   * Open finger auth dialog
   */
  fingerAuth() {
    this.fingerprint.show({
      clientId: 'Cover',
      clientSecret: 'coverAppPassDemo',
      disableBackup: false,
      localizedFallbackTitle: 'Use PIN',
      localizedReason: 'Please authenticate'
    }).then((result: any) => {
      if(result.withFingerprint){
        // fingerprint passed
        this.navCtrl.setRoot('HomePage');
      } else if(result.withPassword) {
        // passcode passed (backup)
        this.navCtrl.setRoot('HomePage');
      } else {
        // cancelled
        console.log('err');
      }
    }).catch(err => {
      console.log(err);
    })
  }

  /**
   * Go to pin page
   */
  gotoPin() {
    this.navCtrl.setRoot('PinConfirmPage');
  }

}
