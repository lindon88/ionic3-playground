import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-cancel',
  templateUrl: 'modal-eos-cancel.html',
})
export class ModalEosCancelPage {
  // vars
  data: any;
  request: any;
  note: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  /**
   * If modal loaded, get params data
   */
  ionViewDidLoad() {
    this.data = this.navParams.get('data');
  }

  /**
   * On save, send back request object
   */
  save() {
    this.request = {
      'shiftRequestId': this.data.requestId,
      'note': this.note
    };

    this.viewCtrl.dismiss(this.request);
  }

  /**
   * On dismiss, send back request object
   */
  dismiss() {
    this.request = {
      'shiftRequestId': null,
      'note': this.note
    };
    this.viewCtrl.dismiss(this.request);
  }
}
