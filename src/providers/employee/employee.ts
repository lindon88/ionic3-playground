import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class EmployeeProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

  public getEmployee(companyId, userId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'hrm/employees/' + userId + '?view=FULL', {headers: headers}).subscribe( (result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  // shifts
  public getAvailableShifts() {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/myAvailableShifts', {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  public getShiftDetails(shiftType: any, shiftId: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/shiftDetails/' + shiftType + '/' + shiftId, {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  public getPersonShiftRequests(personId: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/person/' + personId, {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

}
