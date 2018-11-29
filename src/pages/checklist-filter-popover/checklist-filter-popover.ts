import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
/**
 * Generated class for the ChecklistFilterPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checklist-filter-popover',
  template: `
    <ion-list radio-group>
      <button ion-item detail-none>
        <ion-radio color="secondary" (click)="popoverItemClick($event, true)" item-start [checked]="true"></ion-radio>
        <ion-label color="secondary">Show All Tasks</ion-label>
      </button>
      <ion-item  class="ion-item-with-border">
        <ion-radio color="secondary" (click)="popoverItemClick($event, false)" item-start></ion-radio>
        <ion-label color="secondary">Show Incomplete Tasks</ion-label>
      </ion-item>
    </ion-list>
  `,
})
export class ChecklistFilterPopoverPage {

  constructor(private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  public popoverItemClick(event, value) {
    this.viewCtrl.dismiss(value);
  }

}
