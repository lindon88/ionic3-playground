import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocaleProvider {

  constructor(public http: HttpClient) {
  }

  public getFallbackLocale() {
    return 'en-US';
  }

  public getDeviceLocale() {
    return window.navigator.language;
  }

}
