import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, Platform} from 'ionic-angular';
import {ServerProvider} from "../../providers/server/server";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {LoadingProvider} from "../../providers/loading/loading";
import {FingerprintAIO} from '@ionic-native/fingerprint-aio';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // vars
  public userinfo: any;
  public loginError: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private serverProvider: ServerProvider, public fingerprint:FingerprintAIO, public alertCtrl: AlertController, public authProvider: AuthenticationProvider, public loadingProvider: LoadingProvider) {
    let userToken = localStorage['accessToken'];
    if(userToken) {
      this.navCtrl.setRoot("HomePage");
    }
  }

  ionAfterViewInit() {
    this.navCtrl.setRoot("LoginPage");
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
          if(this.userinfo)
            this.loadingProvider.hideLoader();
          this.loginError = false;
          console.log(this.userinfo.userRoles);
          console.log(this.userinfo);
          if(localStorage.getItem('useFingerprint') !== undefined && localStorage.getItem('useFingerprint') !== null && localStorage.getItem('useFingerprint').length > 0) {
            if(localStorage.getItem('useFingerprint') === 'true' && this.platform.is('cordova')) {
              this.checkFingerprintAIO();
            } else {
              this.pinSetup();
            }
          } else {
            if(this.platform.is('cordova')) {
              this.checkFingerprintAIO();
            } else {
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
      // ask a user if he wants to add a pin
      let alert = this.alertCtrl.create({
        title: "You don't have a PIN",
        subTitle: "Do You want to setup one?",
        buttons: [
          {
            text: 'Agree',
            handler: () => {
              // go to create pin view
              localStorage.setItem('usePIN', 'true');
              this.navCtrl.setRoot("PinCreatePage");
            }
          },
          {
            text: 'Disagree',
            handler: () => {
              localStorage.setItem('usePIN', 'false');
              this.navCtrl.setRoot('HomePage');
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }
}
