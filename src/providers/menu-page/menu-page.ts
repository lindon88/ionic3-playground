import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MenuPageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenuPageProvider {
  public page: any;

  constructor(public http: HttpClient) {
    this.page = '';
  }

  setPage(value) {
    this.page = value;
  }

  getPage() {
    return this.page;
  }

}
