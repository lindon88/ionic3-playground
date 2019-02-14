import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-send',
  templateUrl: 'modal-eos-send.html',
})
export class ModalEosSendPage {
  // vars
  data: any;
  request: any;
  currentPersonId: any;
  note: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  /**
   * If modal loaded, get data params
   */
  ionViewDidLoad() {
    this.data = this.navParams.get('data');
    this.currentPersonId = localStorage.getItem('currentPersonId');
  }

  /**
   * On save, send back request object
   */
  save() {
    this.request = {
      'requesterId': this.currentPersonId,
      'shiftId': this.data.shiftId,
      'requestType': "CAN_WORK",
      'shiftType': this.data.shiftType,
      'requestNote': this.note
    };
    this.viewCtrl.dismiss(this.request);
  }

  /**
   * On dismiss, send back request as null
   */
  dismiss() {
    this.request = null;
    this.viewCtrl.dismiss(this.request);
  }
}
