import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public passwordResetResult: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  gotoLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  resetPassword(data: any) {
    let email = data.email;
    console.log(email);
    this.authProvider.resetPassword(email).then(result => {
      this.passwordResetResult = result;
    });
  }

}
