import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AvailabilityProvider} from "../../providers/availability/availability";
import {ModalShiftAvailabilityPage} from "./modal-shift-availability/modal-shift-availability";
import {ModalShiftPopupPage} from "../employee-shifts/modal-shift-popup/modal-shift-popup";

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

  public PREFERRED: string = 'PREFERRED';
  public UNAVAILABLE: string = 'UNAVAILABLE';

  public effectiveDay: any = new Date().toISOString();
  public currentYear: any = new Date().getFullYear();

  constructor(public navCtrl: NavController, public navParams: NavParams, public availabilityProvider: AvailabilityProvider, private modalCtrl: ModalController) {
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

  /**
   * Sets availability to PREFERRED or UNAVAILABLE
   * @param status
   */
  setAvailability(status: string) {
    let modal = this.modalCtrl.create(ModalShiftAvailabilityPage, {popupTitle: status}, {cssClass: 'modal-shift-availability'});

    modal.present();
  }
}

