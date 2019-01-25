import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";
import {MessagesProvider} from "../../providers/messages/messages";
import {LoadingProvider} from "../../providers/loading/loading";

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
  public showSearch: boolean = false;
  public searchQuery: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public notificationsCounter: NotificationsCounterProvider, public messagesProvider: MessagesProvider, public loadingProvider: LoadingProvider) {
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

  public readNotification(messageId) {
    console.log(messageId);
    if(!messageId) {
      return;
    }
    this.messagesProvider.markAsRead(messageId).then((response: any) => {
      console.log(response);
      if(response.result === 'SUCCESS') {
        this.navCtrl.push('MessageDetailsPage', {message_id: messageId});
      }
    });
  }

  public deleteNotification(message) {

    this.messages.splice(message, 1);
    console.log(this.messages);
    this.messagesProvider.deleteMessage(message.id).then((response: any) => {
      console.log(response);
      this.getMessages();
    })
  }

  public refresh() {
    this.loadingProvider.showLoader();
    this.getMessages();
    this.loadingProvider.hideLoader();
  }

  public toggleSearch() {
    this.showSearch = this.showSearch ? this.showSearch = false : this.showSearch = true;
  }

  public searchItems(ev: any) {
    const val = ev.target.value;

    if(val && val.trim() != '') {
      this.messages = this.messages.filter((message) => {
        return ((message.subject).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.getMessages();
    }
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
