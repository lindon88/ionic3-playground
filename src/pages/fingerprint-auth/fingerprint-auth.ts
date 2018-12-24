import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public fingerprint: FingerprintAIO, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.fingerAuth();
  }

  /**
   * Open finger auth dialog
   */
  fingerAuth() {
    this.fingerprint.show({
      clientId: 'Cover',
      clientSecret: 'coverAppPassDemo',
      disableBackup: true
    }).then((result: any) => {
      if(result.withFingerprint){
        this.navCtrl.setRoot('HomePage');
      } else {
        console.log('err');
      }
    }).catch(err => {
      console.log(err);
    })
  }

  gotoPin() {
    this.navCtrl.setRoot('PinConfirmPage');
  }

}
