import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  // vars
  public passwordResetResult: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
  }

  /**
   * Navigate to login page
   */
  gotoLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  /**
   * Reset password
   * @param data
   */
  resetPassword(data: any) {
    let email = data.email;
    console.log(email);
    this.authProvider.resetPassword(email).then(result => {
      this.passwordResetResult = result;
    });
  }
}
