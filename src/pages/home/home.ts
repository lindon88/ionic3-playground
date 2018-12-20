import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public authProvider: AuthenticationProvider) {
  }

  /**
   * Auth Guard
   */
  ionViewCanEnter() {
    const isAllowed = this.authProvider.isAuth(this.navCtrl);
    if(isAllowed === false) {
      setTimeout(() => {
        this.navCtrl.setRoot('LoginPage');
      }, 0);
    }
    return isAllowed;
  }

  // START - Swipe back enable
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END - Swipe back enable
}
