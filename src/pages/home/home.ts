import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, ViewController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public menuCtrl: MenuController, public authProvider: AuthenticationProvider) {
  }

  /**
   * Auth Guard
   */
  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authProvider.isAuth(this.navCtrl).then((response) => {
        console.log(response);
        if(response === false) {
          this.viewCtrl.dismiss();
          setTimeout(() => {
            this.navCtrl.setRoot("LoginPage");
          }, 0);
        }
        resolve(response);
      }, error => {
        reject(error);
      }).catch(error => {
        console.log(error);
      })
    });
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
