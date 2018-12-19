import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {ServerProvider} from "../../providers/server/server";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public userinfo: any;

  constructor(public navCtrl: NavController, private serverProvider: ServerProvider, public alertCtrl: AlertController, public authProvider: AuthenticationProvider, public loadingProvider: LoadingProvider) {
    let userToken = localStorage['accessToken'];
    if(userToken) {
      this.navCtrl.setRoot("HomePage");
    }
  }

  ionAfterViewInit() {
    this.navCtrl.setRoot("LoginPage");

  }

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
          console.log(this.userinfo.userRoles);
          console.log(this.userinfo);
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
                    this.navCtrl.setRoot("PinCreatePage");
                  }
                },
                {
                  text: 'Disagree',
                  handler: () => {
                    // go to home
                  }
                }
              ]
            });
            alert.present();
          } else {
            // pin already exists, goto pin confirm
            this.navCtrl.setRoot("HomePage")
          }
        })
        this.loadingProvider.hideLoader();
      }
    })
  }

  public gotoReset() {
    this.navCtrl.setRoot("ResetPasswordPage");
  }


}
