import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class CompanyProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
    console.log('Hello CompanyProvider Provider');
  }

  public getAllAllowedCompanies(userId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'permission/allowedCompanies', {headers: headers, params: {userId: userId}}).subscribe( (result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  public getCurrentBusinessDate(companyId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'companyDates/currentBusinessDate/' + companyId, {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

}
