import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-modal-task-note',
  templateUrl: 'modal-task-note.html',
})
export class ModalTaskNotePage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalTaskNotePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
