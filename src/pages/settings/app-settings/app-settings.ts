import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import {NotificationsCounterProvider} from "../../../providers/notifications-counter/notifications-counter";

@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {
  public fingerprintToggle: any = localStorage.getItem('useFingerprint');
  public signedIn: any = localStorage.getItem('keepSignedIn');
  public receivePush: any = localStorage.getItem('receivePush');
  public receiveAlerts: any = localStorage.getItem('receiveAlerts');
  public notificationsBadge: any;

  public fingerprintAvailable: boolean;

  constructor(public navCtrl: NavController, public notificationsCounter: NotificationsCounterProvider, public authProvider: AuthenticationProvider, public platform: Platform, public navParams: NavParams, public fingerprint:FingerprintAIO) {
  }

  /**
   * Auth Guard
   */
  async ionViewCanEnter() {
    let canEnter = await this.canEnter();
    if(canEnter === false) {
      this.navCtrl.setRoot('LoginPage');
      return;
    }
  }

  canEnter() {
    return new Promise((resolve, reject) => {
      return this.authProvider.isAuth(this.navCtrl).then((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  ionViewDidLoad() {
    this.getNotificationsCount();
    console.log('ionViewDidLoad AppSettingsPage');
    console.log('Use fingerprint: ' + localStorage.getItem('useFingerprint'));
    console.log('keepSignedIn: ' + localStorage.getItem('keepSignedIn'));
    console.log('receive push: ' + localStorage.getItem('receivePush'));
    console.log('receive alerts: ' + localStorage.getItem('receiveAlerts'));
    this.canUseFingerprint();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response: any) => {
      this.notificationsBadge = response;
    })
  }

  canUseFingerprint() {
    if (this.platform.is('cordova')) {
      this.fingerprint.isAvailable().then(result => {
        if (result === 'finger') {
          this.fingerprintAvailable = true;
        } else {
          this.fingerprintAvailable = false;
        }
        console.log(this.fingerprintAvailable);
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.fingerprintAvailable = false;
      console.log(this.fingerprintAvailable);
    }
  }

  goToMainProfile() {
    this.navCtrl.pop();
  }

  useFingerprint() {
    localStorage.setItem('useFingerprint', this.fingerprintToggle);
  }

  keepSignedIn() {
    localStorage.setItem('keepSignedIn', String(this.signedIn));
  }

  receivePushNotifications() {
    localStorage.setItem('receivePush', String(this.receivePush));
  }

  receiveAlertsOnUpcomingShifts() {
    localStorage.setItem('receiveAlerts', String(this.receiveAlerts));
  }

}
