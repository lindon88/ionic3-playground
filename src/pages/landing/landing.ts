import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Observable} from "rxjs";
import {ServerProvider} from "../../providers/server/server";
import {ApiProvider} from "../../providers/api/api";
import {TokenProvider} from "../../providers/token/token";
import {PushNotificationsProvider} from "../../providers/push-notifications/push-notifications";

@Component({
  selector: 'landing-page',
  templateUrl: 'landing.html'
})
export class LandingPage {
  // vars
  public animation: any;

  // lottie config
  animationOption = {
    loop: false,
    renderer: 'svg',
    autoplay: true,
    autoloadSegments: true,
    path: './assets/animations/data.json'
  };

  constructor(public navCtrl: NavController, private serverProvider: ServerProvider, private apiProvider: ApiProvider, private tokenProvider: TokenProvider, public platform: Platform, public pushNotificationsProvider: PushNotificationsProvider) {
    // this.pushNotificationsProvider.setAppReady(false);
  }

  // On init, wait 5s to call redirect method
  ionViewDidLoad() {
    this.pushNotificationsProvider.setCurrentPage('landing');
    // timeout for calling redirect function
    Observable.interval(5000).take(1).subscribe(() => this.redirect());
  }

  /**
   * Based on existing data in local storage, redirect to login or pin confirm page
   */
  public redirect() {

    let userToken = localStorage['accessToken'];
    let serverUrl = localStorage['serverUrl'];
    let pin = localStorage['PIN'];
    let keepLoggedIn = localStorage['keepSignedIn'];


    if (userToken === undefined || userToken === null || serverUrl === undefined || serverUrl === null || pin === undefined || pin === null) {
      this.navCtrl.setRoot("LoginPage");
      return;
    }

    if (keepLoggedIn === false) {
      this.navCtrl.setRoot("LoginPage");
      return;
    }

    this.serverProvider.setServerUrl(serverUrl);
    this.serverProvider.setDevServerUrl(serverUrl);
    this.apiProvider.setBaseUrl(this.serverProvider.getServerURL());

    console.log('User token: ' + userToken);
    this.tokenProvider.checkCurrentUser(this.serverProvider.getServerURL()).then((response: any) => {
      console.log("user");
      console.log(response);
      if (response === null || response === undefined || response.userId === undefined) {
        this.navCtrl.setRoot("LoginPage");
      }
      if (localStorage.getItem('useFingerprint') === 'true' && this.platform.is('cordova')) {
        this.navCtrl.setRoot('FingerprintAuthPage');
      } else if(pin === null || pin === undefined || pin === '') {
        this.navCtrl.setRoot('PinCreatePage');
      } else {
        this.navCtrl.setRoot("PinConfirmPage");
      }
    }).catch((err) => {
      console.log(err);
      this.navCtrl.setRoot("LoginPage")
    });
  }

}
