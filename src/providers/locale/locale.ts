import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class LocaleProvider {

  constructor(public http: HttpClient) {
  }

  /**
   * Returns default fallback locale, if for some reason neededd
   */
  public getFallbackLocale() {
    return 'en-US';
  }

  /**
   * Returns device locale
   */
  public getDeviceLocale() {
    return window.navigator.language;
  }

  /**
   * Returns converted date, from object to string in provided format, eg. 'YYYY-MM-DD'
   * @param date
   * @param string
   */
  public convert(date, string) {
    return moment(date).format(string);
  }
}
