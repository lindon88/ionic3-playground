import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from "rxjs";
import {ServerProvider} from "../../providers/server/server";
import {ApiProvider} from "../../providers/api/api";
import {TokenProvider} from "../../providers/token/token";

@Component({
  selector: 'landing-page',
  templateUrl: 'landing.html'
})
export class LandingPage {
  public animation: any;

  animationOption = {
    loop: false,
    renderer: 'svg',
    autoplay: true,
    autoloadSegments: true,
    path: '../../../assets/animations/data.json'
  };

  constructor(public navCtrl: NavController, private serverProvider: ServerProvider, private apiProvider: ApiProvider, private tokenProvider: TokenProvider) {

  }

  ngOnInit() {
    // timeout for calling redirect function
    Observable.interval(5000).take(1).subscribe(() => this.redirect());
  }

  public redirect() {
    let userToken = localStorage['accessToken'];
    let serverUrl = localStorage['serverUrl'];
    let pin = localStorage['pin'];

    if (userToken === undefined || userToken === null || serverUrl === undefined || serverUrl === null || pin === undefined || pin === null) {
      this.navCtrl.setRoot("LoginPage");
      return;
    }
    // set to root, because we don't want to be able to return to landing page
    //this.navCtrl.setRoot("LoginPage");
    this.serverProvider.setServerUrl(serverUrl);
    this.serverProvider.setDevServerUrl(serverUrl);
    this.apiProvider.setBaseUrl(this.serverProvider.getServerURL());

    this.tokenProvider.checkCurrentUser(this.serverProvider.getServerURL()).then((response: any) => {
      console.log("user");
      console.log(response);
      if (response === null || response === undefined || response.userId === undefined) {
        this.navCtrl.setRoot("LoginPage");
      }
      // this.navCtrl.push("PinEntry")
    }).catch((err) => {
      console.log(err);
      this.navCtrl.setRoot("LoginPage")
    });
  }

}
