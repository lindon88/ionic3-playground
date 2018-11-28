import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

/**
 * Generated class for the ChecklistSubtasksPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checklist-subtasks-popover',
  template: `
    <ion-list radio-group>
      <ion-item>
        <ion-radio item-start [checked]="true"></ion-radio>
        <ion-label>Show All Tasks</ion-label>
      </ion-item>
      <ion-item  class="ion-item-with-border">
        <ion-radio item-start></ion-radio>
        <ion-label>Show Incomplete Tasks</ion-label>
      </ion-item>
    </ion-list>
  `,
})
export class ChecklistSubtasksPopoverPage {

  constructor(private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChecklistSubtasksPopoverPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
