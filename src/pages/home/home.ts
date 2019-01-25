import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, ViewController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {MessagesProvider} from "../../providers/messages/messages";
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public notificationsBadge: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public menuCtrl: MenuController, public notificationsCounter: NotificationsCounterProvider, public authProvider: AuthenticationProvider, public events: Events, public messagesProvider: MessagesProvider) {
  }

  public ionViewDidLoad() {
    this.getNotificationsCount();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response:any) => {
      this.notificationsBadge = response;
    })
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

  // START - Swipe back enable
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END - Swipe back enable


}
