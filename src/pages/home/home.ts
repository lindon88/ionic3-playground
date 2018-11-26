import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {MenuPageProvider} from "../../providers/menu-page/menu-page";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public pageMenu: MenuPageProvider) {
    // default-ni view
    this.pageMenu.setPage(1);
  }

  ionAfterViewInit () {

  }

}
