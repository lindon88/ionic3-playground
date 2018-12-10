import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal-drop-absence',
  templateUrl: 'modal-drop-absence.html',
})
export class ModalDropAbsencePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalDropAbsencePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
