import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-eos-cancel',
  templateUrl: 'modal-eos-cancel.html',
})
export class ModalEosCancelPage {
  data: any;
  request: any;
  note: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEosCancelPage');
    this.data = this.navParams.get('data');
    console.log(this.data);
  }

  save() {
    this.request = {
      'shiftReqeustId': this.data.requestId,
      'note': this.note
    };

    this.viewCtrl.dismiss(this.request);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
