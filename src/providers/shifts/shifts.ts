import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class ShiftsProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {

  }

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
}
