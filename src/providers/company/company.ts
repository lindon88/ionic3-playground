import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

/*
  Generated class for the CompanyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompanyProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
    console.log('Hello CompanyProvider Provider');
  }

  public getAllAllowedCompanies(userId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'security/' + userId + '/allowed-companies', {headers: headers}).subscribe( (result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

}
