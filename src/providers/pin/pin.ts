import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

/*
  Generated class for the PinProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {

  }

  /**
   * Save PIN
   * @param personId
   * @param pin
   */
  public save(personId: any, pin: any) {
    return new Promise((resolve, reject) => {
      console.log("PERSON: " + personId + ', PIN: ' + pin);
      let body = {"personId": personId, "pin": pin};
      this.http.post(this.serverProvider.getServerURL() + 'security/updatePIN/' + personId + '?pin=' + pin, body, {headers: {'synergy-login-token': localStorage.getItem('accessToken')}}
      ).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  /**
   * GET PIN
   * @param personId
   * @param pin
   */
  public getPasscode(personId: any, pin: any) {
    return new Promise((resolve, reject) => {
      let body = {personId: personId, pin: pin};
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'security/verifyPIN', {headers: headers, params: body}).subscribe( (result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

}
