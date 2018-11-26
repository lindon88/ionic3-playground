import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello Test2Component Component');
    this.text = 'Hello World 2';
  }

}
