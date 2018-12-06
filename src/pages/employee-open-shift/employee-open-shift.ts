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
    const datePipe = new DatePipe('en-US');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const d = datePipe.transform(endDate, 'yyyy-MM-dd');
    console.log(d);

    this.shiftsProvider.getMyAvailableShifts(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')).then(result => {
      this.availableShifts = result;
      console.log(this.availableShifts);
    });

    this.shiftsProvider.getMyRequests(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')).then(result => {
      this.myRequests = result;
      console.log(this.myRequests);
    });

    Observable.forkJoin(this.getMyAvailableShifts(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')), this.getMyRequests(datePipe.transform(startDate, 'yyyy-MM-dd'), datePipe.transform(endDate, 'yyyy-MM-dd')))
      .subscribe(results => {
        console.log(results);
      });
  }

  private getMyAvailableShifts(start, end) {
    return this.shiftsProvider.getMyAvailableShifts(start, end).then(result => {
      return this.availableShifts = result;
    });
  }

  private getMyRequests(start, end) {
    return this.shiftsProvider.getMyRequests(start, end).then(result => {
      return this.myRequests = result;

    });
  }


}
