import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AvailabilityProvider} from "../../providers/availability/availability";
import {ModalShiftAvailabilityPage} from "./modal-shift-availability/modal-shift-availability";

@IonicPage()
@Component({
  selector: 'page-shift-availability',
  templateUrl: 'shift-availability.html',
})
export class ShiftAvailabilityPage {
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');

  public PREFERRED: string = 'PREFERRED';
  public UNAVAILABLE: string = 'UNAVAILABLE';

  public effectiveDay: any = new Date().toISOString();
  public currentYear: any = new Date().getFullYear();

  public existingData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public availabilityProvider: AvailabilityProvider, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftAvailabilityPage');
    this.getAvailability();
  }

  public getAvailability() {
    this.availabilityProvider.getEmployeeAvailability(this.currentPersonId).then(result => {
      console.log(result);
      this.existingData = result;
    })
  }

  goToMainProfile() {
    this.navCtrl.pop();
  }

  /**
   * Sets availability to PREFERRED or UNAVAILABLE
   * @param status
   */
  setAvailability(status: string) {
    let modal = this.modalCtrl.create(ModalShiftAvailabilityPage, {popupTitle: status}, {cssClass: 'modal-shift-availability'});

    modal.present();

    modal.onDidDismiss(data => {
      if(this.isEmptyObject(data)) {
        console.log('modal data empty');
      } else {
        let type = '';
        if(data.availability === true) {
          type = this.PREFERRED;
        } else {
          type = this.UNAVAILABLE;
        }
        let availability = {};
        availability[type] = {};
        if(type === this.PREFERRED) {
          availability[this.UNAVAILABLE] = {};
        } else {
          availability[this.PREFERRED] = {};
        }
        availability[type][data.weekday] = {};
        if(data.all_day === undefined) {
          data.all_day = false;
        }
        availability[type][data.weekday] = {
          allDay: data.all_day,
          end: {
            display12: this.convertTo12String(data.end_time),
            display24: data.end_time,
            hour12: this.convertTo12(data.end_time),
            hour24: this.convertTo24(data.end_time),
            minute: this.convertToMinute(data.end_time),
            orderableTime: this.convertTo24(data.end_time),
            pm: this.isPM(data.end_time)
          },
          note: null,
          start: {
            display12: this.convertTo12String(data.start_time),
            display24: data.start_time,
            hour12: this.convertTo12(data.start_time),
            hour24: this.convertTo24(data.start_time),
            minute: this.convertToMinute(data.start_time),
            orderableTime: this.convertTo24(data.start_time),
            pm: this.isPM(data.start_time)
          },
          type: type
        };
        if(!this.isEmptyObject(this.existingData)) {
          let obj = this.existingData[0];
          let id = obj.id;

          availability[type][data.weekday] = {
            allDay: data.all_day,
            end: {
              display12: this.convertTo12String(data.end_time),
              display24: data.end_time,
              hour12: this.convertTo12(data.end_time),
              hour24: this.convertTo24(data.end_time),
              minute: this.convertToMinute(data.end_time),
              orderableTime: this.convertTo24(data.end_time),
              pm: this.isPM(data.end_time)
            },
            note: null,
            start: {
              display12: this.convertTo12String(data.start_time),
              display24: data.start_time,
              hour12: this.convertTo12(data.start_time),
              hour24: this.convertTo24(data.start_time),
              minute: this.convertToMinute(data.start_time),
              orderableTime: this.convertTo24(data.start_time),
              pm: this.isPM(data.start_time)
            },
            type: type
          };
          let dbObj = {...this.existingData[0].availability[type], ...availability[type]};
          console.log('DB');
          console.log(dbObj);
          console.log(Object.assign(this.existingData[0].availability[type], dbObj));
          console.log(this.existingData);
        } else {
          let newObj = {
            availability,
            companyId: this.currentCompanyId,
            endDate: null,
            notes: "",
            personId: this.currentPersonId,
            startDate: this.effectiveDay.slice(0, 10)
          };
          this.availabilityProvider.saveEmployeeAvailability(this.currentPersonId, newObj).then((result: any) => {
            console.log(result);
          });
        }

        console.log(this.existingData);
      }
    })
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  private convertTo24(time) {
    let arr = time.split(':');
    return arr[0];
  }

  private convertTo12(time) {
    let hour = this.convertTo24(time);
    return (hour%12) || 12;
  }

  private convertTo12String(time) {
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    let am_pm = (H < 12 || H === 24) ? " AM" : " PM";
    return  (h + time.substr(2, 3) + am_pm);
  }

  private isPM(time) {
    let hour = this.convertTo24(time);
    return hour > 12 === true;
  }

  private convertToMinute(time) {
    let arr = time.split(":");
    return arr[1];
  }

}

