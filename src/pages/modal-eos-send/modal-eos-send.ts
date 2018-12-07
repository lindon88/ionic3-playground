import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-send',
  templateUrl: 'modal-eos-send.html',
})
export class ModalEosSendPage {
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosSendPage');
    this.data = this.navParams.get('data');
    console.log(this.data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
