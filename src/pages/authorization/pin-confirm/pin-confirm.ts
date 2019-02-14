import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PinProvider} from "../../../providers/pin/pin";
import {PushNotificationsProvider} from "../../../providers/push-notifications/push-notifications";
import {RemoteDeviceProvider} from "../../../providers/remote-device/remote-device";

@IonicPage()
@Component({
  selector: 'page-pin-confirm',
  templateUrl: 'pin-confirm.html',
})
export class PinConfirmPage {
  // vars
  public pin: string = '';
  public newPin: string = localStorage.getItem('newPin');
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public pinProvider: PinProvider, public pushNotificationProvider: PushNotificationsProvider, public remoteDeviceProvider: RemoteDeviceProvider) {

  }

  public ionViewDidLoad() {

    this.pushNotificationProvider.setCurrentPage('pin-confirm');
    // init push notifications
    this.pushNotificationProvider.init();

    // init remote notifications
    this.remoteDeviceProvider.init();
  }

  /**
   * Show error
   */
  public showError() {
    this.alertCtrl.create({
      title: "Error",
      message: "Pin does not match"
    }).present().then(() => {
      this.navCtrl.setRoot("PinCreatePage");
    });
  }

  /**
   * Add pin sequence
   * @param num
   */
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
        } else {
          // this.showError();
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

  /**
   * Verify pin
   * @param pin
   */
  public verifyPIN(pin: any) {
    let userId = this.userInfo.userId;
    this.pinProvider.getPasscode(userId, pin).then( (result) => {
      if(result['result'] === 'SUCCESS') {
        localStorage.setItem('currentPersonId', userId);
        // goto HOME
        try {
          let notification = this.pushNotificationProvider.getBackgroundNotification();
          // let currentCorporateId = localStorage.getItem('currentCorporateId');
          this.deviceRegister();
          if(!notification) {
            this.navCtrl.setRoot('HomePage');
            return;
          }
          this.pushNotificationProvider.goToMessage(notification);
        } catch (ex) {
          console.log('Error processing: Corporate requested redirect to LOCK screen');
          this.deviceRegister();
          this.navCtrl.setRoot('HomePage');
        }
        // this.navCtrl.setRoot("HomePage");
      } else if (result['result'] === 'ERROR') {
        let alert = this.alertCtrl.create({
          title: "Login Error",
          message: "Please verify your PIN and try again"
        });
        alert.present();
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Logout method
   */
  public logout() {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }

    if (localStorage.getItem('PIN')) {
      localStorage.removeItem('PIN');
    }

    if (localStorage.getItem('currentCompanyId')) {
      localStorage.removeItem('currentCompanyId');
    }

    if (localStorage.getItem('currentCorporateId')) {
      localStorage.removeItem('currentCorporateId');
    }

    if (localStorage.getItem('currentPersonId')) {
      localStorage.removeItem('currentPersonId');
    }

    if (localStorage.getItem('userInfo')) {
      localStorage.removeItem('userInfo');
    }
    this.userInfo = null;

    this.navCtrl.setRoot("LoginPage");
  }

  public deviceRegister() {
    this.remoteDeviceProvider.verifyRegisterRemoteDevice().then((res) => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }


}
