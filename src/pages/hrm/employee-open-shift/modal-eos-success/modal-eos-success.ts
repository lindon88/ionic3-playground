import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-success',
  templateUrl: 'modal-eos-success.html',
})
export class ModalEosSuccessPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosSuccessPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
