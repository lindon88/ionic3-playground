import { Component } from '@angular/core';

/**
 * Generated class for the Test1Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'test1',
  templateUrl: 'test1.html'
})
export class Test1Component {

  text: string;

  constructor() {
    console.log('Hello Test1Component Component');
    this.text = 'Hello World';
  }

}
