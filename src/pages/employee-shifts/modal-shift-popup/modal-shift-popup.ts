import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {ShiftsProvider} from "../../../providers/shifts/shifts";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public shiftProvider: ShiftsProvider) {
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  clickRequest(shift) {
    if(shift.drop !== undefined) {
      // cancel request
      console.log('cancel request');
      this.shiftProvider.cancelRequest(shift.requestId, this.request).then(response => {
        this.viewCtrl.dismiss();
      })
    } else {
      // send request
      console.log('send request');
      this.shiftProvider.sendRequest(localStorage.getItem('currentPersonId'), this.request).then((response:any) => {
        if(response.success !== undefined && !response.success) {
          // show message
          console.log(response.failMessage);
          return;
        }
        console.log(response.success);

        this.viewCtrl.dismiss();
      })
    }
  }

}
