import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Sets and get application version
 */

@Injectable()
export class ApplicationVersionProvider {

  public VERSION = '1.0.2';

  constructor(public http: HttpClient) {
    this.setVersion(this.VERSION);
  }

  public setDefault() {
    localStorage.setItem('version', this.VERSION);
  }

  public setVersion(version: string) {
    localStorage.setItem('version', version);
  }

  public getVersion() {
    localStorage.getItem('version');
  }

}
