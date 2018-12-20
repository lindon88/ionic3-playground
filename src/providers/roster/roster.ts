import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";
import {isObject} from "rxjs/util/isObject";

@Injectable()
export class RosterProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

  /**
   * Get rosters
   * @param companyId
   */
  public getRosters(companyId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(companyId === undefined || companyId === null || companyId === '') {
        reject('Company Id is not defined');
      }

      this.http.get(this.serverProvider.getServerURL() + 'hrm/rosterEditor/roster/list/' + companyId, {headers: headers}).subscribe((result: any) => {
        if(result !== undefined) {
          resolve(result);
        } else {
          resolve(null);
        }
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get employee shifts
   * @param date
   * @param startDate
   * @param endDate
   * @param options
   */
  public getLoggedEmployeeShifts(date, startDate, endDate, options) {
    let params:any = {};
    if(options !== undefined && options !== null && isObject(options)) {
      params = options;
    }

    if(date) {
      console.log(date);
      params.date = date;
    }

    if(startDate) {
      params.start = startDate;
    }

    if(endDate) {
      params.end = endDate;
    }

    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/rosterEditor/shifts/myShifts', {headers: headers, params: params}).subscribe((result: any) => {
        if(result !== undefined) {
          console.log(result);
          resolve(result);
        } else {
          resolve(null);
        }
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get roster days
   * @param companyId
   * @param params
   */
  public getRosterDaysStatus(companyId, params) {
    return new Promise((resolve, reject) => {
      if(companyId === undefined || companyId === null || companyId === '') {
        reject("Company Id is not defined");
      }

      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'hrm/rosterEditor/days/' + companyId, {headers: headers, params: params}).subscribe((result) => {
        if(result !== undefined) {
          resolve(result);
        }
        resolve(null);
      }, error => {
        reject(error);
      })
    })
  }

}
