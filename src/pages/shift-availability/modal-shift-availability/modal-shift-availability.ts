import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-modal-shift-availability',
  templateUrl: 'modal-shift-availability.html',
})
export class ModalShiftAvailabilityPage {
  public title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalShiftAvailabilityPage');
    this.title = this.navParams.get('popupTitle');
  }

}
