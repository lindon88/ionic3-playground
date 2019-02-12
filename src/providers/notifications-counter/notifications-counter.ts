import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MessagesProvider} from "../messages/messages";

@Injectable()
export class NotificationsCounterProvider {
  public userId: any = localStorage.getItem('currentPersonId');

  constructor(public http: HttpClient, public messagesProvider: MessagesProvider) {
    console.log('Hello NotificationsCounterProvider Provider');
  }

  public getNotificationsCount() {
    return new Promise((resolve, reject) => {
      this.messagesProvider.getMessages(this.userId).then((result) => {
        console.log(result);
        resolve(this.countNotifications(result));
      });
    });
  }

  public countNotifications(data) {
    let count: any = 0;
    if (data !== null && data.items !== undefined && data.items.length !== 0) {
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].messageRead === false && data.items[i].deleted === false) {
          count++;
        }
      }
    }
    if (count > 99) {
      count = '99+';
    }
    return count;
  }

}
