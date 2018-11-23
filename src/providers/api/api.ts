import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiProvider {
  private baseUrl: string = '/rest/';

  constructor(public http: HttpClient) {
  }

  public setBaseUrl(url) {
    this.baseUrl = url;
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getUrl(url) {
    return this.baseUrl + url;
  }

  public getGatewayUrl(url, base) {
    if(base !== undefined && base !== null && base !== '') {
      return base + url;
    }
    return this.baseUrl + url;
  }

}
