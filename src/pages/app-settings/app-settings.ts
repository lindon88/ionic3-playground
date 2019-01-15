import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppSettingsPage');
    console.log('Use fingerprint: ' + localStorage.getItem('useFingerprint'));
    console.log('keepSignedIn: ' + localStorage.getItem('keepSignedIn'));
    console.log('receive push: ' + localStorage.getItem('receivePush'));
    console.log('receive alerts: ' + localStorage.getItem('receiveAlerts'));
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
