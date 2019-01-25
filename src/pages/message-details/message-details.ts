import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {MessagesProvider} from "../../providers/messages/messages";

/**
 * Generated class for the MessageDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-details',
  templateUrl: 'message-details.html',
})
export class MessageDetailsPage {
  public messageId: any;
  public message: any;
  public messageContent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public messagesProvider: MessagesProvider, private view: ViewController) {
  }

  ionViewDidLoad() {
    this.messageId = this.navParams.get('message_id');
    this.getMessages(this.messageId);
    console.log(this.messageId);
  }

  ionViewWillEnter() {
    this.view.showBackButton(true);
  }

  public goToNotifications() {
    this.navCtrl.pop();
  }

  public getMessages(messageId) {
    this.messagesProvider.getMessage(messageId).then((result: any) => {
      this.message = result;
      this.messageContent = this.message.message;
    })
  }

}
