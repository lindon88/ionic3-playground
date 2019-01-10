import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-shift-availability',
  templateUrl: 'modal-shift-availability.html',
})
export class ModalShiftAvailabilityPage {
  public status: string;
  public isAvailable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalShiftAvailabilityPage');
    this.status = this.navParams.get('popupTitle');
    this.isAvailable = this.status === 'PREFERRED';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
