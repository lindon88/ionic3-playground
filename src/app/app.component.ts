import { Component } from '@angular/core';
import {Events, MenuController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from "../pages/landing/landing";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // root page should be landing page
  rootPage:any = LandingPage;
  public user: any;
  public company; any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, menuCtrl: MenuController, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      menuCtrl.swipeEnable(false, 'menu1');
      events.subscribe("user:received", (user) => {
        this.user = user;
        console.log(this.user);
      });
      events.subscribe("company:received", (company) => {
        this.company = company;
      })
    });
  }
}

