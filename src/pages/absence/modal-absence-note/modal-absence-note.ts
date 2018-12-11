import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'page-modal-absence-note',
  templateUrl: 'modal-absence-note.html',
})
export class ModalAbsenceNotePage {
  public request: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.request = this.navParams.get('absenceRequest');
    console.log(this.request);
  }

  formatDate(date, format) {
    date = new Date(date);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
