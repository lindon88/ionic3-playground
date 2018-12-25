import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class EmployeeProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

  /**
   * Get employee
   * @param companyId
   * @param userId
   */
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

  /**
   * not used
   * @param shiftType
   * @param shiftId
   */
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

  /**
   * not used
   * @param personId
   */
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

  /**
   * Saves persons data
   * @param companyId
   * @param person
   */
  public savePerson(companyId: any, person: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'hrm/cm/' + companyId + '/employees', person, {headers: headers}).subscribe((result:any) => {
        resolve(result);
      }, error => {
        reject(JSON.stringify(error));
      })
    })
  }

}
