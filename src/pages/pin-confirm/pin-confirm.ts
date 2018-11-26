import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PinProvider} from "../../providers/pin/pin";

@IonicPage()
@Component({
  selector: 'page-pin-confirm',
  templateUrl: 'pin-confirm.html',
})
export class PinConfirmPage {
  public pin: string = '';
  public newPin: string = localStorage.getItem('newPin');
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public pinProvider: PinProvider) {
  }

  ionAfterViewInit() {
    console.log('ionViewDidLoad PinConfirmPage');
    console.log(localStorage.getItem('userInfo'));
  }

  public showError() {
    this.alertCtrl.create({
      title: "Error",
      message: "Pin does not match"
    }).present().then(() => {
      this.navCtrl.setRoot("PinCreatePage");
    });
  }

  public add(num: string) {
    if (this.pin.length < 4) {
      this.pin += num;
      if (this.pin.length === 4) {
        console.log("Entered four digits");
        if (this.newPin === this.pin) {
          localStorage.setItem("PIN", this.pin);
          let serverPIN = this.pin;
          console.log(this.userInfo.userId + ", " + serverPIN);
          // save to pin service (personID, serverPIN)
          this.pinProvider.save(this.userInfo.userId, serverPIN).then(() => {
            console.log("Successfully posted pin");
          }, () => {
            console.log("Error posting pin");
          });
        }
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
    this.navCtrl.setRoot("PinCreatePage");
  }

  public verifyPIN(pin: any) {
    let userId = this.userInfo.userId;
    this.pinProvider.getPasscode(userId, pin).then( (result) => {
      console.log("RESULT VERIFY");
      console.log(result);
      if(result['result'] === 'SUCCESS') {
        localStorage.setItem('currentPersonId', userId);
        // goto HOME
        this.navCtrl.setRoot("HomePage");
      } else if (result['result'] === 'ERROR') {
        this.alertCtrl.create({
          title: "Login Error",
          message: "Please verify your PIN and try again"
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
