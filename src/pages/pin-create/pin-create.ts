import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pin-create',
  templateUrl: 'pin-create.html',
})
export class PinCreatePage {
  public pin: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
  }

  ionAfterViewInit() {
    this.navCtrl.setRoot("PinCreatePage");
    if(this.navCtrl.canGoBack()) {
      this.platform.exitApp();
    }
    console.log('ionViewDidLoad PinCreatePage');
  }

  /**
   * Adding number to pass code
   * @param num
   */
  public add(num: string) {
    if (this.pin.length < 4) {
      this.pin += num;
      if (this.pin.length === 4) {
        setTimeout(() => {
          console.log('New pin: ' + this.pin);
          localStorage.setItem("newPin", this.pin);
          // goto confirm pin
          this.navCtrl.setRoot("PinConfirmPage");
        }, 300);
      }
    }
  }

  /**
   * Removing characters one by one from pass code
   */
  public delete() {
    if(this.pin.length > 0) {
      this.pin = this.pin.substr(0, this.pin.length - 1);
    }
  }

  /**
   * Cancel creating pin (log out)
   */
  public cancel() {
    this.navCtrl.setRoot("LoginPage");
  }

}
