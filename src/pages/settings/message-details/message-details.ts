import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessagesProvider} from "../../../providers/messages/messages";


@IonicPage()
@Component({
  selector: 'page-message-details',
  templateUrl: 'message-details.html',
})
export class MessageDetailsPage {
  public messageId: any;
  public message: any;
  public messageContent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public messagesProvider: MessagesProvider) {
  }

  ionViewDidLoad() {
    this.messageId = this.navParams.get('message_id');
    this.getMessages(this.messageId);
    console.log(this.messageId);
  }

  ionViewWillEnter() {

  }


  public goToNotifications() {
    this.navCtrl.setRoot('NotificationsPage');
  }

  public getMessages(messageId) {
    this.messagesProvider.getMessage(messageId).then((result: any) => {
      this.message = result;
      this.messageContent = this.message.message;
    })
  }

}
