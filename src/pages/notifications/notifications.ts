import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public notificationsBadge: string;
  public userId: any = localStorage.getItem('currentPersonId');

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public notificationsCounter: NotificationsCounterProvider) {
  }

  ionViewDidLoad() {
    this.getNotificationsCount();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response) => {
      console.log(response);
    })
  }

}
