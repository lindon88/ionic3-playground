import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public authProvider: AuthenticationProvider, public navParams: NavParams) {
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
    console.log('ionViewDidLoad ProfilePage');
    this.loadProfileContent();
  }

  /**
   * Content for main profile page
   */
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
        page: 'AppSettingsPage'
      }
    ]
  }

  /**
   * Manage profile content to go to specific page
   * @param page
   */
  public profileGoTo(page: string) {
    this.navCtrl.push(page);
  }
}
