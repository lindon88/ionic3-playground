import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'page-modal-drop-absence',
  templateUrl: 'modal-drop-absence.html',
})
export class ModalDropAbsencePage {
  // vars
  public request: any;
  public description: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  /**
   * If modal loaded, get params for description and request
   */
  ionViewDidLoad() {
    this.description = this.navParams.get('description');
    this.request = this.navParams.get('request');
  }

  /**
   * Format date
   * @param date
   * @param format
   */
  formatDate(date, format) {
    date = new Date(date);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  /**
   * Return requestID on cancel
   */
  cancelAbsenceRequest() {
    this.viewCtrl.dismiss(this.request.id);
  }

  /**
   * Dismiss modal
   */
  dismiss() {
    console.log(this.description);
    console.log(this.request);
    this.viewCtrl.dismiss();
  }

}
