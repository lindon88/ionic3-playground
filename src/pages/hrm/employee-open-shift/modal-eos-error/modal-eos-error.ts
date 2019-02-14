import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-error',
  templateUrl: 'modal-eos-error.html',
})
export class ModalEosErrorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosErrorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
