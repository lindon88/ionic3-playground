import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-shift-availability',
  templateUrl: 'modal-shift-availability.html',
})
export class ModalShiftAvailabilityPage {
  public status: string;
  public isAvailable: boolean;
  public week_day: any;
  public start_time: any;
  public end_time: any;
  public all_day: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalShiftAvailabilityPage');
    this.status = this.navParams.get('popupTitle');
    this.isAvailable = this.status === 'PREFERRED';
  }

  dismiss() {
    let availabilityObj = {};
    this.viewCtrl.dismiss(availabilityObj);
  }

  save() {
    let availabilityObj = {
      weekday: this.week_day,
      start_time: this.start_time,
      end_time: this.end_time,
      availability: this.isAvailable,
      all_day: this.all_day
    };

    this.viewCtrl.dismiss(availabilityObj);
  }

}
