import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {ServerProvider} from "../../providers/server/server";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public userinfo: any;

  constructor(public navCtrl: NavController, private serverProvider: ServerProvider, public alertCtrl: AlertController, public authProvider: AuthenticationProvider) {

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

        this.authProvider.login(username, password).then((result) => {
          this.userinfo = result;
          console.log(this.userinfo.userRoles);
        })
      }
    })
  }


}
