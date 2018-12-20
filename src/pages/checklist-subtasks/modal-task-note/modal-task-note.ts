import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-modal-task-note',
  templateUrl: 'modal-task-note.html',
})
export class ModalTaskNotePage {
  // vars
  note: string = '';
  task: any;
  data: any= [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  /**
   * On modal load, get params
   */
  ionViewDidLoad() {
    this.task = this.navParams.get('data');
    this.note = this.task.note;
    console.log(this.task);
  }

  /**
   * On dismiss, pass task and note back
   * It will be empty
   */
  dismiss() {
    this.data = {
      'task': null,
      'note': null
    };
    this.viewCtrl.dismiss(this.data);
  }

  /**
   * On save, pass task and note back
   */
  saveNote() {
    this.data = {
      'task': this.task,
      'note': this.note
    };
    this.viewCtrl.dismiss(this.data);
  }
}
