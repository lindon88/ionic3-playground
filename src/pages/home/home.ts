import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider) {
    // this.navCtrl.setRoot("HomePage");

  }

  ionViewCanEnter() {
    const isAllowed = this.authProvider.isAuth(this.navCtrl);
    if(isAllowed === false) {
      setTimeout(() => {
        this.navCtrl.setRoot('LoginPage');
      }, 0);
    }
    return isAllowed;
  }

}
