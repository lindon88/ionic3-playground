import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RosterProvider} from "../../providers/roster/roster";
import {ShiftsProvider} from "../../providers/shifts/shifts";
import {AbsenceProvider} from "../../providers/absence/absence";
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";

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

  public weekDays: any = [];

  public showAlert: boolean;

  public viewType: any;

  public shiftsObservableResponse: any;
  public openShiftsObservableResponse: any;
  public daysObservableResponse: any;
  public absenceTypesObservableResponse: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rosterProvider: RosterProvider, public shiftsProvider: ShiftsProvider, public absenceProvider: AbsenceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeShiftsPage');
    this.loadWeekRosters(this.currentCompanyId);
    this.viewType = this.selectedView.code;
    let date = new Date();
    console.log(date);
    this.loadEmployeeShiftsForSelectedDate(date);
  }


  public setMonthDayFormat() {
    if (window.screen.width < 380) {
      this.monthTextFormat = 'short';
      this.dayTextFormat = 'short';
    } else {
      this.monthTextFormat = 'long';
      this.dayTextFormat = 'long';
    }
  }

  public loadWeekRosters(companyId) {
    console.log("Load week rosters");
    if (!companyId) {
      return false;
    }
    if (this.weekRosters && this.weekRosters.length > 0) {
      this.selectedRoster = this.lastSelectedRoster;
    }

    this.rosterProvider.getRosters(companyId).then((response: any) => {
      if (!response) {
        this.weekRosters = null;
        this.showAlert = true;
        return;
      }

      if (response.length === 0) {
        this.showAlert = true;
        return;
      }

      this.weekRosters = [];
      for (let i = 0; i < response.length; i++) {
        let item = response[i];
        item.formatedEndDate = item.endDate;
        if (item.formatedEndDate) {
          item.description = 'Week Ending ' + item.formatedEndDate;
        }

        if (item.published !== undefined && item.published) {
          this.weekRosters.push(item);
        }
      }

      if (this.weekRosters.length === 0) {
        this.showAlert = true;
        return;
      }

      this.selectedRoster = this.weekRosters[0];

      console.log(this.weekRosters);
    }, error => {
      console.log(error);
    })
  }

  public loadEmployeeShifts(date, startDate, endDate) {
    let observableBatch = [];
    observableBatch.push(this.getShifts(date, startDate, endDate, {publishedOnly: true}));

    if(startDate !== undefined && endDate !== undefined) {
      observableBatch.push(this.getOpenShifts(startDate, endDate));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: startDate}));
    } else if (date !== undefined) {
      observableBatch.push(this.getOpenShifts(date, date));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: date}));
    }

    if(!this.absenceTypes) {
      observableBatch.push(this.getAbsenceTypes(this.currentCorporateId));
    }

    Observable.forkJoin(observableBatch).subscribe(response => {
      console.log(response);

      if(!response) return;

      this.shiftsObservableResponse = response[0];
      this.openShiftsObservableResponse = response[1];
      this.daysObservableResponse = response[2];
      this.absenceTypesObservableResponse = response[3];

      if(this.absenceTypesObservableResponse !== undefined) {
        this.absenceTypes = this.absenceTypesObservableResponse;
      }

      if(this.shiftsObservableResponse === undefined || this.shiftsObservableResponse.employees === undefined) {
        return;
      }

      this.employee = this.shiftsObservableResponse.employees[0];
      console.log(this.employee);

      this.shifts = [];
      // define shifts
      if(this.employee.shifts !==  undefined) {
        console.log('not undefined');
        console.log(this.employee.shifts);
        for(let i in this.employee.shifts) {
          if(this.employee.shifts.hasOwnProperty(i)){
            let item = this.employee.shifts[i];

            for(let key in item) {
              if(item.hasOwnProperty(key)) {
                let shift = item[key];

                // check if shift is locked
                if(this.daysObservableResponse !== undefined && this.daysObservableResponse.length > 0) {
                  for(let j in this.daysObservableResponse) {
                    if(this.daysObservableResponse.hasOwnProperty(j)){
                      let dayObj = this.daysObservableResponse[j];
                      if(dayObj.date === shift.shiftDate) {
                        shift.locked = dayObj.locked;
                      }
                    }
                  }
                }

                if(shift.warnings !== undefined && shift.warnings !== null && shift.warnings.length > 0) {
                  shift.hasWarning = true;
                }

                // define shift title
                if(shift.offsiteDisplay !== undefined && shift.offsiteDisplay !== null && shift.offsiteDisplay !== '') {
                  shift.title = shift.offsiteDisplay;
                }

                // append shift that does not have delete status
                if(shift.delete === undefined && !shift.delete && !shift.hiddenShift) {
                  this.weekDays[shift.shiftDate] = {has: true};
                  // todo Nemanja: format date

                  this.shifts.push(shift);
                }
              }
            }
          }
        }
        console.log(this.shifts);
        console.log(this.weekDays);
      }

      // set absences
      if(this.employee.absences !== undefined) {
        let weekDays = Object.keys(this.weekDays);
        for(let i = 0; i < weekDays.length; i++) {
          let weekDay = weekDays[i];
          console.log(weekDay);
          if(this.employee.absences[weekDay] !== undefined) {
            let absence = this.employee.absences[weekDay];
            for(let j = 0; j < this.absenceTypes.length; j++) {
              let absenceType = this.absenceTypes[j];
              console.log(absenceType);
              if(absenceType.id == absence.absenceTypeId) {
                this.weekDays[weekDay] = {has: true};
                this.shifts.push({
                  title: absenceType.description,
                  shiftDate: weekDay,
                });

              }
            }
          }
        }
        console.log(this.shifts);
      }

      // define open shifts (Show them just as request pending)
      if(this.openShiftsObservableResponse !== undefined) {
        let weekDays = Object.keys(this.weekDays);
        for(let i = 0; i < weekDays.length; i++) {
          let weekDay = weekDays[i];
          for(let k = 0; k < this.openShiftsObservableResponse.length; k++) {
            let openShift = this.openShiftsObservableResponse[k];
            if(openShift.date == weekDay && openShift.requestType === 'CAN_WORK' && openShift.shiftType === 'OPEN_SHIFT' && openShift.status === 'PENDING') {
              this.shifts.push({
                title: 'Request pending',
                openShift: true,
                shiftDate: weekDay
              })
            }
          }
        }
        console.log(this.shifts);
      }

      // fill full week with data
      // for the days which do not have defined shifts or absences add empty item (Day off)
      console.log(this.weekDays);
      for(let index in this.weekDays) {
        if(this.weekDays.hasOwnProperty(index)){
          let item = this.weekDays[index];
          console.log(item);
          if(!item.has) {
            this.shifts.push({
              title: 'Day Off',
              shiftDate: index
            })
          }
        }
      }
      console.log(this.shifts);
    })
  }

  public loadEmployeeShiftsForSelectedDate(date) {
    let formattedDate = this.convertDateToLocale(date, 'yyyy-MM-dd');
    this.weekDays = [];
    this.weekDays[formattedDate] = {has: false};
    this.loadEmployeeShifts(formattedDate, undefined, undefined);
  }

  public convertDateToLocale(date, format) {
    // const locale = window.navigator.language;
    const locale = 'en-GB';
    date = new Date(date);
    const datePipe = new DatePipe(locale);
    return datePipe.transform(date, format);
  }

  public onWeekRosterChange() {
    if (!this.selectedRoster) {
      return;
    }
    this.weekRosterStart = this.selectedRoster.startDate;
    this.weekRosterEnd = this.selectedRoster.endDate;

    console.log(this.selectedRoster.startDate + ' - ' + this.selectedRoster.endDate);

    this.loadEmployeeShifts(undefined, this.selectedRoster.startDate, this.selectedRoster.endDate);
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
