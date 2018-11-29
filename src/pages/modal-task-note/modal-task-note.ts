import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-modal-task-note',
  templateUrl: 'modal-task-note.html',
})
export class ModalTaskNotePage {
  task: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.task = this.navParams.get('data');
    console.log(this.task);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
