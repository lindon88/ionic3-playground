import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatePipe} from "@angular/common";
import {ShiftsProvider} from "../../providers/shifts/shifts";
import {Observable} from "rxjs";


/**
 * Generated class for the EmployeeOpenShiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-employee-open-shift',
  templateUrl: 'employee-open-shift.html',
})
export class EmployeeOpenShiftPage {
  // shift types
  OPEN_SHIFT: string = 'OPEN_SHIFT';
  SHIFT: string = 'SHIFT';

  // shift statuses
  PENDING: string = 'PENDING';
  APPROVED: string = 'APPROVED';
  REJECTED: string = 'REJECTED';
  CANCELLED: string = 'CANCELLED';

  // shift request types
  CAN_WORK: string = 'CAN_WORK';
  CANNOT_WORK: string = 'CANNOT_WORK';
  PREFER_NOT_WORK: string = 'PREFER_NOT_WORK';

  // current logged in user data
  currentPersonId: any;
  currentCompanyId: any;
  currentCorporateId: any;

  // list of shifts
  availableShifts: any;
  myRequests: any;

  // sections
  sections: any;

  // jobs
  jobs: any;

  // message note
  messageInput: any;

  // selected shift
  selectedShift: any;

  // month and date format
  monthTextFormat: string = 'MMMM';
  dayTextFormat: string = 'EEEE';

  constructor(public navCtrl: NavController, public navParams: NavParams, public shiftsProvider: ShiftsProvider) {
  }

  ionViewDidLoad() {
    this.currentPersonId = localStorage.getItem('currentPersonId');
    this.currentCompanyId = localStorage.getItem('currentCompanyId');
    this.currentCorporateId = localStorage.getItem('currentCorporateId');

    this.loadOpenShifts();
  }

  public loadOpenShifts() {
    this.availableShifts = {};
    const datePipe = new DatePipe('en-US');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const d = datePipe.transform(endDate, 'yyyy-MM-dd');
    console.log(d);

    Observable.forkJoin(this.getMyAvailableShifts(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')), this.getMyRequests(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')))
      .subscribe(results => {
        const [availableShifts, requests] = results;
        for(let i = 0; i < (<any>availableShifts).length; i++) {
          let item = availableShifts[i];
          if(requests && (<any>requests).length > 0) {
            for(let j = 0; j < (<any>requests).length; j++) {
              let request = requests[j];
              if(item.shiftId == request.shiftId) {
                item.status = request.status;
                item.requestType = request.requestType;
                item.requesterEmployee = request.requesterEmployee;
                item.requestId = request.id;

                (<any>requests).splice(j, 1);
                break;
              }
            }
          }
          this.formatShift(item);
          this.availableShifts.push(item);
        }
      });
  }

  private getMyAvailableShifts(start, end) {
    return this.shiftsProvider.getMyAvailableShifts(start, end).then(result => {
      return result;
    });
  }

  private getMyRequests(start, end) {
    return this.shiftsProvider.getMyRequests(start, end).then(result => {
      return result;
    });
  }

  private formatShift(shift) {
    const date = new Date(shift.shiftDate);
    shift.monthText = date.getMonth();

    console.log(shift.monthText);
  }


}
