import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class MessagesProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

  public getMessages(personId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      let params = { personId: personId };
      this.http.get(this.serverProvider.getServerURL() + 'MessagingWebService/messages/person', {headers: headers, params: params}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }


}
