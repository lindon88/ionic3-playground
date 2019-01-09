import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AvailabilityProvider} from "../../providers/availability/availability";

/**
 * Generated class for the ShiftAvailabilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shift-availability',
  templateUrl: 'shift-availability.html',
})
export class ShiftAvailabilityPage {
  public currentPersonId: any = localStorage.getItem('currentPersonId');

  constructor(public navCtrl: NavController, public navParams: NavParams, public availabilityProvider: AvailabilityProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftAvailabilityPage');
    this.getAvailability();
  }

  public getAvailability() {
    this.availabilityProvider.getEmployeeAvailability(this.currentPersonId).then(result => {
      console.log(result);
    })
  }

  goToMainProfile() {
    this.navCtrl.pop();
  }
}

