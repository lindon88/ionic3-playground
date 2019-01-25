import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";
import {LoadingProvider} from "../loading/loading";

@Injectable()
export class MessagesProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider, public  loadingProvider: LoadingProvider) {
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

  public markAsRead(messageId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.put(this.serverProvider.getServerURL() + 'MessagingWebService/messages/message/markasread?messageId=' + messageId, {params: messageId}, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      });
    })
  }

  public getMessage(messageId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'MessagingWebService/messages/message', {params: {messageId: messageId}, headers:header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  public deleteMessage(messageId) {
    console.log(messageId);
    this.loadingProvider.showLoader();
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.delete(this.serverProvider.getServerURL() + 'MessagingWebService/messages/message', {params: {messageId: messageId}, headers:header}).subscribe((result: any) => {
        console.log('deleted');
        this.loadingProvider.hideLoader();
        resolve(result);

      }, error => {
        console.log('Delete failed');
        this.loadingProvider.hideLoader();
        reject(error);
      })
    })
  }
}
