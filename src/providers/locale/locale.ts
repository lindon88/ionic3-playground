import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

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

  public convert(date, string) {
    return moment(date).format(string);
  }

}
