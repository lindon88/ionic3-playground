import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, Platform} from 'ionic-angular';
import {ServerProvider} from "../../providers/server/server";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {LoadingProvider} from "../../providers/loading/loading";
import {FingerprintAIO} from '@ionic-native/fingerprint-aio';
import {Events} from 'ionic-angular';
import {PushNotificationsProvider} from "../../providers/push-notifications/push-notifications";
import {RemoteDeviceProvider} from "../../providers/remote-device/remote-device";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // vars
  public userinfo: any;
  public loginError: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private serverProvider: ServerProvider, public fingerprint:FingerprintAIO, public alertCtrl: AlertController, public authProvider: AuthenticationProvider, public loadingProvider: LoadingProvider, public events: Events, public pushNotificationProvider: PushNotificationsProvider, public remoteDeviceProvider: RemoteDeviceProvider) {
    this.pushNotificationProvider.setAppReady(true);
  }

  ionAfterViewInit() {
    this.navCtrl.setRoot("LoginPage");

    // initialize push notifications
    this.pushNotificationProvider.init();

    // init remote device provider
    this.remoteDeviceProvider.init();

  }

  /**
   * Login method
   * @param data
   */
  public login(data: any) {
    let username = data.email;
    let password = data.password;
    let connectionStatus = this.serverProvider.checkConnection();
    connectionStatus.then((data: any) => {
      if(!data.connected) {
        this.alertCtrl.create({
          title: 'Connection Error',
          message: 'SynergySuite app requires network connection. Please check your connection and try again',
        });
      } else if (data.connectionScore < 20) {
        this.alertCtrl.create({
          title: 'Poor Connection',
          message: 'SynergySuite app detects a weak connection in your current location. Please move to a location with stronger connection and try again',
        });
      } else {
        console.log('Username ' + username);
        console.log('Password ' + password);
        this.loadingProvider.showLoader();
        this.authProvider.login(username, password).then((result) => {
          this.userinfo = result;
          if(this.userinfo) {
            this.events.publish('user:logged', result);
            this.loadingProvider.hideLoader();
          }
          this.loginError = false;
          const useFingerprint = localStorage.getItem('useFingerprint');

          if(useFingerprint === '' && useFingerprint === undefined && useFingerprint === null && this.platform.is('cordova')) {
            this.checkFingerprintAIO();
          }
          if(this.userinfo.userPIN === undefined || this.userinfo.userPIN === null || this.userinfo.userPIN === '') {
            this.navCtrl.setRoot('PinCreatePage');
          } else {
            try {
              let notification = this.pushNotificationProvider.getBackgroundNotification();
              // let currentCorporateId = localStorage.getItem('currentCorporateId');
              this.deviceRegister();
              if(!notification) {
                this.navCtrl.setRoot('HomePage');
                return;
              }
              if(result)
                this.pushNotificationProvider.goToMessage(notification);
            } catch (ex) {
              console.log('Error processing: Corporate requested redirect to LOCK screen');
              this.deviceRegister();
              this.navCtrl.setRoot('HomePage');
            }
          }

        }).catch(error => {
          console.log(error);
          if(error) {
            this.loadingProvider.hideLoader();
            this.loginError = true;
          }
        });
        if(this.userinfo) {
          this.loadingProvider.hideLoader();
        }
      }
    })
  }

  /**
   * Navigate to reset page
   */
  public gotoReset() {
    this.navCtrl.setRoot("ResetPasswordPage");
  }

  /**
   * Check if device uses fingerprint
   */
  public checkFingerprintAIO() {
    console.log('show fp');
    // @ts-ignore
    this.fingerprint.isAvailable().then(result => {
      if(result === "finger") {
        let alert = this.alertCtrl.create({
          title: 'Fingerprint Login',
          message: 'Do you want to login using your fingerprint on this device?',
          buttons: [
            {
              text: 'No Thanks',
              handler: () => {
                localStorage.setItem('useFingerprint', 'false');
                this.navCtrl.setRoot('PinConfirmPage');
              }
            },
            {
              text: 'Yes Please',
              handler: () => {
                localStorage.setItem('useFingerprint', 'true');
                this.navCtrl.setRoot('FingerprintAuthPage');
              }
            }
          ]
        });
        alert.present();
      } else {
        if(this.userinfo.userPIN !== null && this.userinfo.userPIN !== undefined) {
          this.navCtrl.setRoot('HomePage');
        } else {
          this.pinSetup();
        }
      }
      // alert(result);
    }).catch(error => {
      console.log(error);
      if(this.userinfo.userPIN !== null && this.userinfo.userPIN !== undefined) {
        this.navCtrl.setRoot('HomePage');
      } else {
        this.pinSetup();
      }
    })
  }

  /**
   * Check if user have, use or want to use pin
   */
  private pinSetup() {
    if (this.userinfo.userPIN === null || this.userinfo.userPIN === undefined) {
      this.navCtrl.setRoot("PinCreatePage");
    } else if(localStorage.getItem('PIN')) {
      this.navCtrl.setRoot('HomePage');
    } else {
      this.navCtrl.setRoot('PinConfirmPage');
    }
  }

  public deviceRegister() {
    this.remoteDeviceProvider.verifyRegisterRemoteDevice().then((res) => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }
}
