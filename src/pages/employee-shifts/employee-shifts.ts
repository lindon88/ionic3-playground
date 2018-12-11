import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-employee-shifts',
  templateUrl: 'employee-shifts.html',
})
export class EmployeeShiftsPage {
  public VIEW_WEEK: string = 'week';
  public VIEW_MONTH: string = 'month';

  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  public selectedView: any = {
    code: this.VIEW_WEEK
  };

  public viewTypes: any = [
    {
      code: this.VIEW_WEEK,
      description: 'Weekly Schedule'
    },
    {
      code: this.VIEW_MONTH,
      description: 'Monthly Schedule'
    }
  ];

  public weekRosters: any = [];
  public selectedRoster: any = null;
  public lastSelectedRoster: any = null;

  public employee: any = null;
  public shifts: any = null;
  public sections: any = null;
  public jobs: any = null;
  public absenceTypes: any = null;

  public monthTextFormat: string = 'long';
  public dayTextFormat: string = 'long';

  public weekRosterStart: any;
  public weekRosterEnd: any;

  public weekDays: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeShiftsPage');
  }

  public setMonthDayFormat() {
    if(window.screen.width < 380) {
      this.monthTextFormat = 'short';
      this.dayTextFormat = 'short';
    } else {
      this.monthTextFormat = 'long';
      this.dayTextFormat = 'long';
      this.dayTextFormat = 'long';
    }
  }

  public loadWeekRosters(companyId) {
    if(!companyId) {
      return false;
    }
    if(this.weekRosters && this.weekRosters.length > 0) {
      this.selectedRoster = this.lastSelectedRoster;
    }
  }

  public onWeekRosterChange() {
    if(!this.selectedRoster) {
      return;
    }
    this.weekRosterStart = this.selectedRoster.startDate;
    this.weekRosterEnd = this.selectedRoster.endDate;

    let iteration = this.selectedRoster.startDate;

    this.weekDays = {};

    while(iteration <= this.weekRosterEnd) {
      this.weekDays[iteration] = {
        has: false
      };
      iteration.setDate(iteration.getDate() + 1);
    }
  }

  public loadEmployeeShifts(date, startDate, endDate) {

  }

}
