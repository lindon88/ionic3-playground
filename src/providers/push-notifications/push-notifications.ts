import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RemoteDeviceProvider} from "../remote-device/remote-device";
import {MessagesProvider} from "../messages/messages";
import {FCM} from "@ionic-native/fcm";
import {AlertController, App, Events} from "ionic-angular";
import {Device} from "@ionic-native/device";

declare let window: any;

@Injectable()
export class PushNotificationsProvider {
  ready: boolean = false;
  authRequired: boolean = true;

  constructor(public app: App, public http: HttpClient, public remoteDeviceProvider: RemoteDeviceProvider, public events: Events, public messagesProvider: MessagesProvider, public fcm: FCM, public device: Device, public alertCtrl: AlertController) {
  }

  public init() {
    if (window.cordova === undefined) {
      return;
    }
    // initialize remote device
    this.remoteDeviceProvider.init();

    // already defined push notifications
    if (this.ready) {
      return;
    }

    // set ready
    this.ready = true;
    // this.ready = this.getAppReady();

    this.handleGetToken();
    this.handleTokenRefresh();
    this.handleNotification();
  }

  public handleGetToken() {
    if (!this.ready) {
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
    if (!this.ready) {
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

    this.fcm.onNotification().subscribe((notification: any) => {
      // if(!this.ready || !notification || notification.synergyMessageId === undefined) {
      //   return;
      // }
      if (!notification.wasTapped) {
        // show ionic popup
        this.showMobileNotification(notification);
        this.events.publish('notification:add', notification);
        return;
      }

      if(!this.authRequired && notification.wasTapped) {
        this.goToMessage(notification);
      }

      // register background notification
      this.registerBackgroundNotification(notification);
    }, error => {
      console.log(error);
    })
  }

  /**
   * Set authentication is required
   * @param status
   */
  public setAuthenticationRequired(status: any) {
    console.log("SET AUTH STATUS: " + status);
    this.authRequired = status;
  }

  public setAppReady(status: any) {
    this.ready = status;
  }

  public getAppReady() {
    return this.ready;
  }

  public goToMessage(notification: any) {
    console.log('READY STATUS - ' + this.ready);
    if(this.ready === false) {
      return;
    }
    localStorage.setItem('backgroundNotification', null);
    this.app.getActiveNav().push('MessageDetailsPage', {message_id: notification.synergyMessageId});
  }

  /**
   * Get background notification
   */
  public getBackgroundNotification() {
    if (!this.ready) {
      return false;
    }

    let notification = JSON.parse(localStorage.getItem('backgroundNotification'));
    if (!notification || notification === null || notification.synergyMessageId === undefined) {
      return false;
    }

    return notification;
  }

  public showMobileNotification(notification: any) {
    if (!notification) {
      return;
    }

    // check if authentication is required
    if(this.authRequired) {
      return;
    }

    let title = '';
    let body = '';

    if (this.device !== undefined && this.device !== null && this.device.platform !== undefined && this.device.platform.toLowerCase() === 'ios') {
      if (notification.aps !== undefined && notification.aps !== null && notification.aps.alert !== undefined && notification.aps.alert !== null) {
        title = notification.aps.alert.title;
        body = notification.aps.alert.body;
      }
    } else {
      title = notification.title;
      body = notification.text;
    }

    const alert = this.alertCtrl.create({
      title: "Notification",
      message: "<span><b>" + body + "</b></span></br> Do you want to open message?",
      subTitle: title,
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: "Open",
          handler: () => {
            if (notification.synergyMessageId !== undefined) {
              this.app.getActiveNav().push("MessageDetailsPage", {message_id: notification.synergyMessageId});
            }
          }
        }
      ]
    });
    alert.present();
  }

  public registerBackgroundNotification(notification: any) {
    localStorage.setItem('backgroundNotification', JSON.stringify(notification));
    // this.goToMessage(notification);
  }

}
