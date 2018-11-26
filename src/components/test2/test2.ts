import { Component } from '@angular/core';
import {MenuPageProvider} from "../../providers/menu-page/menu-page";

/**
 * Generated class for the Test2Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'test2',
  templateUrl: 'test2.html'
})
export class Test2Component {
  public page: any;
  text: string;

  constructor(public pageMenu: MenuPageProvider) {
    console.log('Hello Test2Component Component');
    this.text = 'Hello World 2';
    this.page = this.pageMenu.getPage();
    console.log(this.page);
  }

}
