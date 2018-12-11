import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class RosterProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

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

}
