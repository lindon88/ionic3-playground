import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-modal-shift-availability',
  templateUrl: 'modal-shift-availability.html',
})
export class ModalShiftAvailabilityPage {
  public status: string;
  public isAvailable: boolean;
  public week_day: any;
  public start_time: any;
  public end_time: any;
  public all_day: any;

  public data: any;
  public day: any;

  public days:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalShiftAvailabilityPage');
    this.status = this.navParams.get('popupTitle');
    this.isAvailable = this.status === 'PREFERRED';
    this.data = this.navParams.get('data');
    this.day = this.navParams.get('day');
    console.log(this.data);
    console.log(this.days);

    if(this.data !== null && this.data !== undefined && this.day !== null && this.data !== undefined) {
      this.week_day = this.day;
      if(this.data.allDay === false) {
      this.start_time = this.fixTime(this.data.start.display24);
      this.end_time = this.fixTime(this.data.end.display24);
      }
      this.all_day = this.data.allDay;
      this.isAvailable = this.data.type === 'PREFERRED';
    }
  }

  onDayChange(code: any) {
    for(let day in this.data) {
      if(code === day) {
        console.log(this.data[code]);
        this.week_day = code;
        if(this.data[code].allDay === false) {
          this.start_time = this.fixTime(this.data[code].start.display24);
          this.end_time = this.fixTime(this.data[code].end.display24);
        }
        this.all_day = this.data[code].allDay;
        this.isAvailable = this.data[code].type === 'PREFERRED';
      }
    }
  }

  fixTime(time) {
    if(time === null) return;
    if(time.length < 5) {
      return ('0' + time).slice(0);
    }
    return time;
  }

  dismiss() {
    let availabilityObj = {};
    this.viewCtrl.dismiss(availabilityObj);
  }

  save() {
    let type = '';
    if(this.data !== null) {
      type = this.data.type
    }
    let availabilityObj = {
      weekday: this.week_day,
      start_time: this.start_time,
      end_time: this.end_time,
      availability: this.isAvailable,
      all_day: this.all_day,
      fixedAvailability: type
    };

    this.viewCtrl.dismiss(availabilityObj);
  }

  delete() {
    let availabilityObj = {
      weekday: this.week_day,
      start_time: null,
      end_time: null,
      availability: this.isAvailable,
      all_day: null,
      delete: true
    };
    console.log(availabilityObj);
    this.viewCtrl.dismiss(availabilityObj);
  }

}
