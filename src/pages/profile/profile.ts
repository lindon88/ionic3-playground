import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";

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
  public notificationsBadge: any;

  constructor(public navCtrl: NavController, public notificationsCounter: NotificationsCounterProvider, public menuCtrl: MenuController, public viewCtrl: ViewController, public authProvider: AuthenticationProvider, public navParams: NavParams) {
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
    console.log('ionViewDidLoad ProfilePage');
    this.loadProfileContent();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response: any) => {
      this.notificationsBadge = response;
    })
  }


  // START - Swipe back enable
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END - Swipe back enable

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
