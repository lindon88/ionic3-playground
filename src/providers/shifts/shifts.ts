import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class ShiftsProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {

  }

  /**
   * Get available shifts for logged user
   * @param start
   * @param end
   */
  public getMyAvailableShifts(start, end) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(!start) {
        resolve('Start date must be defined');
      } else {
        const params = {
          start: start,
          end: end
        };
        this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/myAvailableShifts', {params: params, headers: headers}).subscribe((result: any) => {
          resolve(result);
        }, (error) => {
          reject(error);
        });
      }
    });
  }

  /**
   * get requests
   * @param start
   * @param end
   */
  public getMyRequests(start, end) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(!start) {
        reject("Start date must be defined");
      } else {
        const params = {
          start: start,
          end: end
        };
        this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/myRequests', {params: params, headers: headers}).subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
      }
    });
  }

  /**
   * get shift details
   * @param shiftType
   * @param shiftId
   */
  public getShiftDetails(shiftType, shiftId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(!shiftType) {
        resolve("Shift type must be defined");
      }
      if(!shiftId) {
        resolve("Shift id must be defined");
      }
      return this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/shiftDetails' + '/' + shiftType + '/' + shiftId, {headers: headers}).subscribe(result => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * cancel request
   * @param shiftId
   * @param request
   */
  public cancelRequest(shiftId, request) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(!shiftId) {
        reject("Shift id must be defined!");
      }
      if(!request) {
        reject("Request must be defined!");
      }
      return this.http.put(this.serverProvider.getServerURL() + 'hrm/shiftRequest' + '/' + shiftId + '/cancel', request, {headers: headers}).subscribe(result => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * send request
   * @param personId
   * @param request
   */
  public sendRequest(personId, request) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      if(!personId) {
        reject("Person id must be defined!");
      }
      if(!request) {
        reject("Request must be defined!");
      }

      return this.http.post(this.serverProvider.getServerURL() + 'hrm/shiftRequest/person' + '/' + personId, request, {headers: headers}).subscribe(result => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }
}
