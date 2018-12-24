import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public profile_content: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loadProfileContent();
  }

  public loadProfileContent() {
    this.profile_content = [
      {
        header: 'Personal Details',
        description: 'Update details for your HR team',
        page: 'PersonDetailsPage'
      },
      {
        header: 'Request Payroll Changes',
        description: 'Communicate Bank or Payroll Changes',
        page: 'PayrollPage'
      },
      {
        header: 'Shift Availability',
        description: 'Advise managers your availability throughout the week to avoid shift swaps',
        page: 'ShiftAvailabilityPage'
      },
      {
        header: 'App Settings',
        description: 'Manage any app settings, such as fingerprint login',
        page: 'SettingsPage'
      }
    ]
  }

  public profileGoTo(page: string) {
    this.navCtrl.push(page);
  }
}
