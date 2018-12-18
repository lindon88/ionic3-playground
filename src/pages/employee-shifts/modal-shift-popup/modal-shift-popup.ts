import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the ModalShiftPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-modal-shift-popup',
  templateUrl: 'modal-shift-popup.html',
})
export class ModalShiftPopupPage {

  public request: any;
  public title: any;
  public shift: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalShiftPopupPage');
    this.title = this.navParams.get('popupTitle');
    this.request = this.navParams.get('request');
    this.shift = this.navParams.get('shift');
    console.log(this.shift);
  }

  public persistLongMonth(date) {
    date = new Date(date);
    return date.toLocaleString('en-US', {month: 'long'});
  }

  public persistLongWeekDay(date) {
    date = new Date(date);
    return date.toLocaleString('en-US', {weekday: 'long'});
  }

}
