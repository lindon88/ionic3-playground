import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

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
  public checked: boolean;

  constructor(private viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.checked = this.navParams.get('checked');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  public popoverItemClick(event, value) {
    this.checked = this.navParams.get('checked');
    this.viewCtrl.dismiss(value);
  }

}
