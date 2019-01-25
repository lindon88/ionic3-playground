import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";
import {MessagesProvider} from "../../providers/messages/messages";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public notificationsBadge: string;
  public messages: any;
  public userId: any = localStorage.getItem('currentPersonId');
  public locale: string = window.navigator.language;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public notificationsCounter: NotificationsCounterProvider, public messagesProvider: MessagesProvider) {
  }

  ionViewDidLoad() {
    this.getNotificationsCount();
    this.getMessages();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response: any) => {
      this.notificationsBadge = response;
    })
  }

  public getMessages() {
    this.messagesProvider.getMessages(this.userId).then((response: any) => {
      this.messages = response.items;
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    })
  }

  public convertToDate(date) {
    return new Date(date);
  }

  public convertToMonthText(date) {
    let newDate = new Date(date);
    return newDate.toLocaleString(this.locale, {month: 'short'});
  }

  public convertToDayText(date) {
    let newDate = new Date(date);
    return newDate.toLocaleString(this.locale, {weekday: 'short'});
  }

  public convertToDateNumber(date) {
    let newDate = new Date(date);
    return newDate.toLocaleString(this.locale, {day: 'numeric'})
  }

}
