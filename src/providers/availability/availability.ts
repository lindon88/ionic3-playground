import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

/*
  Generated class for the AvailabilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AvailabilityProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
    console.log('Hello AvailabilityProvider Provider');
  }

  public getEmployeeAvailability(employeeId: any) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/rosterAvailability/' + employeeId, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  public saveEmployeeAvailability(employeeId: any, data: any) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'hrm/rosterAvailability/' + employeeId, data, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  public updateAvailability(employeeId: any, id: any, data: any) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.put(this.serverProvider.getServerURL() + 'hrm/rosterAvailability/' + employeeId + '/' + id, data, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  public removeAvailability(employeeId: any, id: any) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.delete(this.serverProvider.getServerURL() + 'html/rosterAvailability/' + employeeId + '/' + id, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

}
