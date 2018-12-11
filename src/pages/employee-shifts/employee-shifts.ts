import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RosterProvider} from "../../providers/roster/roster";
import {ShiftsProvider} from "../../providers/shifts/shifts";
import {AbsenceProvider} from "../../providers/absence/absence";

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
  public openShifts: any = null;
  public days: any = null;


  public sections: any = null;
  public jobs: any = null;
  public absenceTypes: any = null;

  public monthTextFormat: string = 'long';
  public dayTextFormat: string = 'long';

  public weekRosterStart: any;
  public weekRosterEnd: any;

  public weekDays: any = {};

  public showAlert: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rosterProvider: RosterProvider, public shiftsProvider: ShiftsProvider, public absenceProvider: AbsenceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeShiftsPage');
    this.loadWeekRosters(this.currentCompanyId);
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
    console.log("Load week rosters");
    if(!companyId) {
      return false;
    }
    if(this.weekRosters && this.weekRosters.length > 0) {
      this.selectedRoster = this.lastSelectedRoster;
    }

    this.rosterProvider.getRosters(companyId).then((response: any) => {
      if(!response) {
        this.weekRosters = null;
        this.showAlert = true;
        return;
      }

      if(response.length === 0) {
        this.showAlert = true;
        return;
      }

      this.weekRosters = [];
      for(let i = 0; i < response.length; i++) {
        let item = response[i];
        item.formatedEndDate = item.endDate;
        if(item.formatedEndDate) {
          item.description = 'Week Ending ' + item.formatedEndDate;
        }

        if(item.published !== undefined && item.published) {
          this.weekRosters.push(item);
        }
      }

      if(this.weekRosters.length === 0) {
        this.showAlert = true;
        return;
      }

      this.selectedRoster = this.weekRosters[0];

      console.log(this.weekRosters);
    }, error => {
      console.log(error);
    })
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

  private getShifts(date, startDate, endDate, options) {
    return this.rosterProvider.getLoggedEmployeeShifts(date, startDate, endDate, options).then(result => {
      return result;
    })
  }

  private getOpenShifts(start, end) {
    return this.shiftsProvider.getMyRequests(start, end).then(result => {
      return result;
    })
  }

  private getDays(companyId, params) {
    return this.rosterProvider.getRosterDaysStatus(companyId, params).then(result => {
      return result;
    })
  }

  private getAbsenceTypes(corporateId) {
    return this.absenceProvider.getAbsenceTypes(corporateId).then(result => {
      return result;
    })
  }

}
