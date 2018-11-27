import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";

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
  currentPersonId: string = localStorage.getItem('currentPersonId');
  selectedCompanyId: string = localStorage.getItem('currentCompanyId');
  currentCorporateId: string = localStorage.getItem('currentCorporateId');
  public myAvailableShiftsData: any;
  public personShiftRequests: any;
  public startDate: any;
  public endDate: any;
  public request: any;
  public myPendingRequest: any[] = [];
  public myShiftRequests: any[] = [];
  public myOpenShiftCurrentWeekRequests: any[] = [];
  public shiftRequest: any;
  public futureAvailableShifts: any[] = [];
  public openAvailableShifts: any[] = [];
  public allAvailableShifts: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public employeeProvider: EmployeeProvider) {
  }

  public getMyAvailableShifts() {
    this.employeeProvider.getAvailableShifts().then((data:any) => {
      this.myAvailableShiftsData = data;
      if(data.length > 0) {
        for(let i = 0; i < data.length; i++) {
          // call function shiftDetails(shiftType, shiftId)
          this.employeeProvider.getShiftDetails(data[i].shiftType, data[i].shiftId).then((res: any) => {
            if (i === this.myAvailableShiftsData.length) {
              // person shift requests
              for(let j = 0; j < this.personShiftRequests; i++) {
                let shift_req = this.personShiftRequests;
                if(shift_req.requestType === 'CAN_WORK') {
                  if((shift_req.shiftId === data[i].shiftId && shift_req.status === 'PENDING' && shift_req === 'OPEN_SHIFT')
                    || shift_req.shiftId === data[i].shiftId && shift_req.status === 'REJECTED' && shift_req === 'OPEN_SHIFT'
                    || shift_req.shiftId === data[i].shiftId && shift_req.status === 'CANCELLED' && shift_req === 'OPEN_SHIFT'
                    || shift_req.shiftId === data[i].shiftId && shift_req.status === 'PENDING' && shift_req === 'SHIFT'
                    || shift_req.shiftId === data[i].shiftId && shift_req.status === 'REJECTED' && shift_req === 'SHIFT'
                    || shift_req.shiftId === data[i].shiftId && shift_req.status === 'CANCELLED' && shift_req === 'SHIFT') {
                    this.shiftRequest = shift_req;
                    if(this.myPendingRequest[this.shiftRequest.shiftId] === undefined || this.myPendingRequest[this.shiftRequest.shiftId] === null) {
                      this.myPendingRequest[this.shiftRequest.shiftId] = this.shiftRequest;
                    }
                    this.myPendingRequest[this.shiftRequest.shiftId] = this.shiftRequest;
                    this.myOpenShiftCurrentWeekRequests.push(data[i]);
                  }
                }
              }
              if(data[i].shiftDate > this.endDate) {
                this.futureAvailableShifts.push(data[i]);
              }
              if(data[i].shiftDate >= this.startDate && data[i].shiftDate <= this.endDate) {
                this.openAvailableShifts.push(data[i]);
              }

              this.allAvailableShifts.push(data[i]);
            }
          }, (err) => {console.log(err); });
        }
      }
    }, (error) => {
      console.log(error);
    })
  }

  public getPersonShiftRequests() {
    this.employeeProvider.getPersonShiftRequests(this.currentPersonId).then((data: any) => {
      this.personShiftRequests = data;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.employeeProvider.getShiftDetails(data[i].shiftType, data[i].shiftId).then((res: any) => {
             if((i === this.personShiftRequests.lenth) && (data[i].date >= this.startDate && data[i].date <= this.endDate)) {
               if(data[i].requestType === 'CANNOT_WORK' && data[i].requestType === 'PREFER_NOT_WORK') {
                 if((data[i].shiftId === res.shiftId && data[i].status === 'PENDING' && data[i].shiftType === 'SHIFT')
                   || (data[i].shiftId === res.shiftId && data[i].status === 'REJECTED' && data[i].shiftType === 'SHIFT')) {
                   this.request = data[i];
                   if(this.myPendingRequest[this.request.shiftId] === undefined || this.myPendingRequest[this.request.shiftId] === null) {
                     this.myPendingRequest[this.request.shiftId] = {};
                   }
                   this.myPendingRequest[this.request.shiftId] = this.request;
                   this.myPendingRequest.push(res);
                 }
               }
             }
          }, (err) => {
            console.log(err);
          })
        }
      }
    })
  }


}
