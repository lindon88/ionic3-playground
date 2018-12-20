import {Component, Input} from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: 'tab.html'
})
export class TabComponent {

  /**
   * Set input for tab (parameter that is accessible cross-component)
   */
  @Input('tabTitle') title: string;
  @Input() active = false;

}
