import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
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
    <ion-list class="filter-radio-list" radio-group>
      <button ion-item detail-none>
        <ion-radio color="link" (click)="popoverItemClick($event, true)" item-start [checked]="checked === true"></ion-radio>
        <ion-label color="link">Show All Tasks</ion-label>
      </button>
      <button ion-item detail-none>
        <ion-radio color="link" (click)="popoverItemClick($event, false)" item-start [checked]="checked === false"></ion-radio>
        <ion-label color="link">Show Incomplete Tasks</ion-label>
      </button>
    </ion-list>
  `,
})
export class ChecklistFilterPopoverPage {
  public checked: boolean = true;
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
