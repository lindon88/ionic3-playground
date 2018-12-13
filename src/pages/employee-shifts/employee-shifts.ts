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
    this.loadWeekRosters(this.currentCompanyId);
    this.viewType = this.selectedView.code;
    let date = new Date();
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
      this.weekRosters = this.sortByDate(this.weekRosters);
      console.log(this.weekRosters);
      this.selectedRoster = this.weekRosters[0];
    }, error => {
      console.log(error);
    })
  }

  public loadEmployeeShifts(date, startDate, endDate) {
    let observableBatch = [];
    observableBatch.push(this.getShifts(date, startDate, endDate, {publishedOnly: true}));

    if (startDate !== undefined && endDate !== undefined) {
      observableBatch.push(this.getOpenShifts(startDate, endDate));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: startDate}));
      console.log('-+-+-+-+-+-+-+-Start date: ' + startDate);
    } else if (date !== undefined) {
      observableBatch.push(this.getOpenShifts(date, date));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: date}));
      console.log('+-+-+-+-+-+-+-+Date: ' + date);
    }

    if (!this.absenceTypes) {
      observableBatch.push(this.getAbsenceTypes(this.currentCorporateId));
    }

    Observable.forkJoin(observableBatch).subscribe(response => {
      console.log(response);

      if (!response) return;

      this.shiftsObservableResponse = response[0];
      this.openShiftsObservableResponse = response[1];
      this.daysObservableResponse = response[2];
      this.absenceTypesObservableResponse = response[3];

      // define all week days
      this.weekDays = this.daysObservableResponse;

      this.defineShifts(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);
      this.defineAbsences(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);
      this.defineOpenShifts(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);
      this.fillFullWeekWithData(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);

      this.shifts = this.sortShiftByDate(this.shifts);

      console.log(this.shifts);
    })
  }

  /**
   * Defining shifts
   * @param shifts
   * @param openShifts
   * @param days
   * @param absences
   */
  public defineShifts(shifts, openShifts, days, absences) {
    this.employee = shifts.employees[0];
    this.shifts = [];
    console.log(this.employee);
    if (this.employee.shifts !== undefined) {
      for (let i in this.employee.shifts) {
        if (this.employee.shifts.hasOwnProperty(i)) {
          let item = this.employee.shifts[i];

          for (let j in item) {
            if (item.hasOwnProperty(j)) {
              let shift = item[j];
              shift = this.defineShiftDropCancelStatus(shift, openShifts);
              shift = this.checkIfShiftLocked(days, shift);
              console.log('ITEM');
              console.log(shift);

              // check if shifty has warnings
              if (shift.warnings !== undefined && shift.warnings !== null && shift.warnings.length > 0) {
                shift.hasWarning = true;
              }

              // define shift title
              if (shift.offsiteDisplay && shift.offsiteDisplay !== null && shift.offsiteDisplay !== '') {
                shift.title = shift.offsiteDisplay;
              }

              // append shift that does not have delete status
              let date = new Date(shift.shiftDate);
              if (shift.delete === undefined && !shift.delete && !shift.hiddenShift) {
                for(let k in this.weekDays) {
                  let weekDay = this.weekDays[k];
                  if(weekDay.date === shift.shiftDate) {
                    this.weekDays[k] = {has: true};
                  }
                }
                // this.weekDays[shift.shiftDate] = {has: true};
                shift.monthText = date.toLocaleString('en-US', {month: 'long'});
                shift.dayText = date.toLocaleString('en-US', {weekday: 'long'});
                shift.dayNumber = date.getDay();

                this.shifts.push(shift);
              }
            }
          }
        }
      }
    }
  }

  public defineAbsences(shifts, openShifts, days, absences) {
    this.absenceTypes = absences;
    let weekDays = Object.keys(this.weekDays);
    weekDays.forEach(weekDay => {
      if (this.employee.absences[weekDay] !== undefined) {
        let absence = this.employee.absences[weekDay];
        console.log('±±±±±±±± ABSENCE ±±±±±±±±');
        console.log(absence);
        for (let key in this.absenceTypes) {
          if (this.absenceTypes.hasOwnProperty(key)) {
            let absenceType = this.absenceTypes[key];
            if (absenceType.id === absence.absenceTypeId) {
              this.weekDays[weekDay] = {has: true};
              let date = new Date(weekDay);
              this.shifts.push({
                title: absenceType.description,
                shiftDate: weekDay,
                monthText: date.toLocaleString('en-US', {month: 'long'}),
                dayText: date.toLocaleString('en-US', {weekday: 'long'}),
                dayNumber: date.getDay()
              });
            }
          }
        }
      }
    })
  }

  public defineOpenShifts(shifts, openShifts, days, absences) {
    let weekDays = Object.keys(this.weekDays);
    weekDays.forEach(weekDay => {
      for (let key in openShifts) {
        if (openShifts.hasOwnProperty(key)) {
          let openShift = openShifts[key];
          if (openShift.date === weekDay && openShift.requestType === 'CAN_WORK' && openShift.shiftType === 'OPEN_SHIFT' && openShift.status === 'PENDING') {
            let date = new Date(weekDay);
            this.shifts.push({
              title: 'Request pending',
              openShift: true,
              shiftDate: weekDay,
              monthText: date.toLocaleString('en-US', {month: 'long'}),
              dayText: date.toLocaleString('en-US', {weekday: 'long'}),
              dayNumber: date.getDay()
            })
          }
        }
      }
    })
  }

  public fillFullWeekWithData(shifts, openShifts, days, absences) {
    console.log('WEEKDAYS DB');
    console.log(this.weekDays);
    console.log(this.shifts);
    for (let i in this.weekDays) {
      if (this.weekDays.hasOwnProperty(i)) {
        let item = this.weekDays[i];

        console.log(item);
        if(!item.has) {
          let date = new Date(item.date);
          this.shifts.push({
            title: 'Day Off',
            shiftDate: item.date,
            monthText: date.toLocaleString('en-US', {month: 'long'}),
            dayText: date.toLocaleString('en-US', {weekday: 'long'}),
            dayNumber: date.getDay()
          })
        }
      }
    }
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
    console.log(params);
    return this.rosterProvider.getRosterDaysStatus(companyId, params).then(result => {
      return result;
    })
  }

  private getAbsenceTypes(corporateId) {
    return this.absenceProvider.getAbsenceTypes(corporateId).then(result => {
      return result;
    })
  }

  /**
   * Defining drop or delete status
   * @param shift
   * @param openShifts
   */
  private defineShiftDropCancelStatus(shift, openShifts) {
    if (shift === undefined || openShifts === undefined) {
      return;
    }

    for (let i = 0; i < openShifts.length; i++) {
      let openShift = openShifts[i];

      if (shift.id === openShift.shiftId) {
        if (openShift.requestType === 'CANNOT_WORK') {
          if (openShift.status === 'APPROVED') {
            shift.delete = true;
          } else if (openShift.status === 'PENDING') {
            shift.drop = true;
            shift.requestId = openShift.id;
          }
        }
      }
    }
    return shift;
  }

  private checkIfShiftLocked(days, shift) {
    if (days !== undefined) {
      days.forEach(dayObj => {
        if (dayObj.date === shift.shiftDate) {
          shift.locked = dayObj.locked;
        }
      })
    }
    return shift;
  }

  private sortByDate(array) {
    return array.sort(function (a, b) {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });
  }

  private sortShiftByDate(array) {
    return array.sort(function(a, b) {
      return new Date(a.shiftDate).getTime() - new Date(b.shiftDate).getTime();
    })
  }

}
