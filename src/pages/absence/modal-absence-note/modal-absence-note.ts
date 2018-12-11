import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-absence-note',
  templateUrl: 'modal-absence-note.html',
})
export class ModalAbsenceNotePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAbsenceNotePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
