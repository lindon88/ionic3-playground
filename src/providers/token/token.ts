import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenProvider {

  constructor(public http: HttpClient) {
  }

  /**
   * Check current user
   * @param url
   */
  public checkCurrentUser (url: string) {
    let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
    return new Promise((resolve, reject) => {
      this.http.get(url + 'security/userAccount/current', {headers: headers}).subscribe(data => {resolve(data)});
    })
  }

}
