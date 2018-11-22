import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from "rxjs";

@Component({
  selector: 'landing-page',
  templateUrl: 'landing.html'
})
export class LandingPage {

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    // timeout for calling redirect function
    Observable.interval(5000).take(1).subscribe(() => this.redirect());
  }

  public redirect() {
    // set to root, because we don't want to be able to return to landing page
    this.navCtrl.setRoot("LoginPage");
  }

}
