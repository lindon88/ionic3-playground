import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class CountryProvider {

  constructor(public http: HttpClient, private serverProvider: ServerProvider) {
  }

  public getCountries() {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'security/countries', {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }
}
