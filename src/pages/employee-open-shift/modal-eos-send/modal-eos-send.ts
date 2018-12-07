import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-send',
  templateUrl: 'modal-eos-send.html',
})
export class ModalEosSendPage {
  data: any;
  request: any;
  currentPersonId: any;
  note: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosSendPage');
    this.data = this.navParams.get('data');
    console.log(this.data);
    this.currentPersonId = localStorage.getItem('currentPersonId');
  }

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

  dismiss() {
    this.request = null;
    this.viewCtrl.dismiss(this.request);
  }

}
