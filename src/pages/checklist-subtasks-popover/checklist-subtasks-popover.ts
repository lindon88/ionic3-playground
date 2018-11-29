import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-checklist-subtasks-popover',
  template: `
    <ion-list radio-group>
      <button ion-item detail-none>
        <ion-radio color="secondary" (click)="popoverItemClick($event, true)" item-start [checked]="checked === true"></ion-radio>
        <ion-label color="secondary">Show All Tasks</ion-label>
      </button>
      <ion-item  class="ion-item-with-border">
        <ion-radio color="secondary" (click)="popoverItemClick($event, false)" item-start [checked]="checked === false"></ion-radio>
        <ion-label color="secondary">Show Incomplete Tasks</ion-label>
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
