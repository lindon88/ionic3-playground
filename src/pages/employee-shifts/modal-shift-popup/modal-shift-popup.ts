import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ShiftsProvider} from "../../../providers/shifts/shifts";

@Component({
  selector: 'page-modal-shift-popup',
  templateUrl: 'modal-shift-popup.html',
})
export class ModalShiftPopupPage {

  // vars
  public request: any;
  public title: any;
  public shift: any;

  public showWarning: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public shiftProvider: ShiftsProvider, public alertCtrl: AlertController) {
  }

  /**
   * On modal load get params data
   */
  ionViewDidLoad() {
    this.title = this.navParams.get('popupTitle');
    this.request = this.navParams.get('request');
    this.shift = this.navParams.get('shift');

    this.showWarning = this.navParams.get('warning');
  }

  /**
   * Set long month text
   * @param date
   */
  public persistLongMonth(date) {
    date = new Date(date);
    return date.toLocaleString('en-US', {month: 'long'});
  }

  /**
   * Set long weekday text
   * @param date
   */
  public persistLongWeekDay(date) {
    date = new Date(date);
    return date.toLocaleString('en-US', {weekday: 'long'});
  }

  /**
   * Dismiss modal with false parameter
   */
  dismiss() {
    this.viewCtrl.dismiss(false);
  }

  /**
   * On click, if drop -> cancel request, else -> send request
   * Pass back true
   * @param shift
   */
  clickRequest(shift) {
    if(shift.drop !== undefined) {
      // cancel request
      this.shiftProvider.cancelRequest(shift.requestId, this.request).then(response => {
        this.viewCtrl.dismiss(true);
      })
    } else {
      // send request
      this.shiftProvider.sendRequest(localStorage.getItem('currentPersonId'), this.request).then((response:any) => {
        if(response.success !== undefined && !response.success) {
          // show message
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: response.failMessage,
            buttons: [{text: 'OK', cssClass: 'save-button-eos', handler: () => {
              console.log('ok => ' + response.failMessage);
              this.viewCtrl.dismiss();
            }}]
          });
          alert.present();
          return;
        }
        this.viewCtrl.dismiss(true);
      })
    }
  }
}
