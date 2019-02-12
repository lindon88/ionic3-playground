import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RemoteDeviceProvider} from "../remote-device/remote-device";
import {MessagesProvider} from "../messages/messages";
import {FCM} from "@ionic-native/fcm";
import {AlertController, App} from "ionic-angular";
import {Device} from "@ionic-native/device";

declare let window: any;
@Injectable()
export class PushNotificationsProvider {
  ready: boolean = false;
  authRequired: boolean = true;

  constructor(public app: App, public http: HttpClient, public remoteDeviceProvider: RemoteDeviceProvider, public messagesProvider: MessagesProvider, public fcm: FCM, public device: Device, public alertCtrl: AlertController) {
  }

  public init() {
    if(window.cordova === undefined) {
      return;
    }
    // initialize remote device
    this.remoteDeviceProvider.init();

    // already defined push notifications
    if(this.ready) {
      return;
    }

    // set ready
    this.ready = true;

    this.handleGetToken();
    this.handleTokenRefresh();
    this.handleNotification();
  }

  public handleGetToken() {
    if(!this.ready) {
      return;
    }
    try {
      this.fcm.getToken().then(token => {
        console.log(token);
        this.remoteDeviceProvider.setPushNotificationToken(token);
      }, error => {
        alert(error);
        console.log(error);
      })
    } catch (ex) {
      alert(ex);
      console.log('Error: ' + ex);
    }
  }

  public handleTokenRefresh() {
    if(!this.ready) {
      return;
    }
    try {
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
        this.remoteDeviceProvider.setPushNotificationToken(token);
      }, error => {
        alert(error);
        console.log(error);
      })
    } catch (ex) {
      console.log('Error: ' + ex);
    }
  }

  public handleNotification() {
    try {
      this.fcm.onNotification().subscribe((notification: any) => {
        console.log('============Notification');
        console.log(notification);
        // console.log(JSON.parse(notification.default));
        // let message = JSON.parse(notification.default);
        // console.log(message.GCM);
        // let notify = JSON.parse(message.GCM);
        // console.log(notify);
        if(!notification || notification === null || notification.wasTapped === undefined || notification.synergyMessageId === undefined) {
          return;
        }
        if(notification.wasTapped == false) {
          // show ionic popup
          this.showMobileNotification(notification);
          return;
        }

        if(!this.authRequired) {
          // goto message
          this.goToMessage(notification);
          return;
        }

        // register background notification
        this.registerBackgroundNotification(notification);
      }, error => {
        console.log(error);
      })
    } catch (ex) {
      console.log('Error: ' + ex);
    }
  }

  /**
   * Set authentication is required
   * @param status
   */
  public setAuthenticationRequired(status: any) {
    this.authRequired = status;
  }

  public goToMessage(notification: any) {
    console.log(notification);
    if(!this.ready || !notification || notification.synergyMessageId === undefined) {
      this.app.getActiveNav().setRoot('HomePage');
      return;
    }

    localStorage.setItem('backgroundNotification', null);
    this.app.getActiveNav().setRoot('MessageDetailsPage', {message_id: notification.synergyMessageId});
  }

  /**
   * Get background notification
   */
  public getBackgroundNotification() {
    if(!this.ready) {
      return false;
    }

    let notification = JSON.parse(localStorage.getItem('backgroundNotification'));
    if(!notification || notification === null || notification.synergyMessageId === undefined) {
      return false;
    }

    return notification;
  }

  public showMobileNotification(notification: any) {
    if(!notification) {
      return;
    }

    // check if authentication is required
    // if(this.authRequired) {
    //   return;
    // }

    let title = '';
    let body = '';

    if(this.device !== undefined && this.device !== null && this.device.platform !== undefined && this.device.platform.toLowerCase() === 'ios') {
      if(notification.aps !== undefined && notification.aps !== null && notification.aps.alert !== undefined && notification.aps.alert !== null) {
        title = notification.aps.alert.title;
        body = notification.aps.alert.body;
      }
    } else {
      title = notification.title;
      body = notification.text;
    }

    const alert = this.alertCtrl.create({
      title: "Notification",
      message: "<span><b>"+body+"</b></span></br> Do you want to open message?",
      subTitle: title,
      buttons: [
        {
          text: "Cancel",
          handler: ()  => {
            console.log('Cancel');
          }
        },
        {
          text: "Open",
          handler: () => {
            if(notification.synergyMessageId !== undefined) {
              this.app.getActiveNav().push("MessageDetailsPage", {message_id:  notification.synergyMessageId});
            }
          }
        }
      ]
    });
    alert.present();
  }

  public registerBackgroundNotification(notification: any) {
    localStorage.set('backgroundNotification', JSON.parse(notification));
  }

}
