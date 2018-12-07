import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-modal-task-note',
  templateUrl: 'modal-task-note.html',
})
export class ModalTaskNotePage {
  note: string = '';
  task: any;
  data: any= [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.task = this.navParams.get('data');
    this.note = this.task.note;
    console.log(this.task);
  }

  dismiss() {
    this.data = {
      'task': this.task,
      'note': this.note
    };
    this.viewCtrl.dismiss(this.data);
  }

  saveNote() {
    this.data = {
      'task': this.task,
      'note': this.note
    };
    this.viewCtrl.dismiss(this.data);
  }

}
