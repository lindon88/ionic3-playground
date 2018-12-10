import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'page-modal-drop-absence',
  templateUrl: 'modal-drop-absence.html',
})
export class ModalDropAbsencePage {
  public request: any;
  public description: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalDropAbsencePage');
    this.description = this.navParams.get('description');
    this.request = this.navParams.get('request');

  }

  formatDate(date, format) {
    date = new Date(date);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  // return request id for deleting
  cancelAbsenceRequest() {
    this.viewCtrl.dismiss(this.request.id);
  }

  dismiss() {
    console.log(this.description);
    console.log(this.request);
    this.viewCtrl.dismiss();
  }

}
