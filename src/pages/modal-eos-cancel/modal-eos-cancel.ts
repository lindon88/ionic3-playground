import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-cancel',
  templateUrl: 'modal-eos-cancel.html',
})
export class ModalEosCancelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosCancelPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
