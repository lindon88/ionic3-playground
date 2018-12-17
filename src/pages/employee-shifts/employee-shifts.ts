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

  // monthly
  public currentEvents: any = [];
  public monthViewData: any = [];
  public monthShift: any = [];

  public dayShiftCount: number  = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rosterProvider: RosterProvider, public shiftsProvider: ShiftsProvider, public absenceProvider: AbsenceProvider) {
  }

  ionViewDidLoad() {

    this.loadWeekRosters(this.currentCompanyId);
    this.viewType = this.selectedView.code;
    let date = new Date();
    this.setMonthDayFormat();

    // load month
    let monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let monthEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.loadEmployeeMonthShifts(this.convertDateToLocale(monthStartDate, 'yyyy-MM-dd'), this.convertDateToLocale(monthEndDate, 'yyyy-MM-dd'));
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
      this.selectedRoster = this.weekRosters[0];
      this.weekRosterStart = this.selectedRoster.startDate;
      this.weekRosterEnd = this.selectedRoster.endDate;


      this.loadEmployeeShifts(undefined, this.selectedRoster.startDate, this.selectedRoster.endDate);
    }, error => {
      console.log(error);
    })
  }

  public loadEmployeeShifts(date, startDate, endDate) {
    let observableBatch = [];

    if (startDate !== undefined && endDate !== undefined) {
      observableBatch.push(this.getShifts(undefined, startDate, endDate, {publishedOnly: true}));
      observableBatch.push(this.getOpenShifts(startDate, endDate));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: startDate}));
    } else if (date !== undefined) {
      observableBatch.push(this.getShifts(date, undefined, undefined, {publishedOnly: true}));
      observableBatch.push(this.getOpenShifts(date, date));
      observableBatch.push(this.getDays(this.currentCompanyId, {date: date}));
    }


    observableBatch.push(this.getAbsenceTypes(this.currentCorporateId));


    Observable.forkJoin(observableBatch).subscribe(response => {

      if (!response) return;

      this.shiftsObservableResponse = response[0];
      this.openShiftsObservableResponse = response[1];
      this.daysObservableResponse = response[2];
      this.absenceTypesObservableResponse = response[3];

      // define all week days
      this.weekDays = this.daysObservableResponse;
      this.absenceTypes = this.absenceTypesObservableResponse;

      this.defineShifts(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);
      this.defineAbsences(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypes);
      this.defineOpenShifts(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);
      this.fillFullWeekWithData(this.shiftsObservableResponse, this.openShiftsObservableResponse, this.daysObservableResponse, this.absenceTypesObservableResponse);

      this.shifts = this.sortShiftByDate(this.shifts);
      console.log(this.shifts);
    })
  }

  public loadEmployeeMonthShifts(startDate, endDate) {
    console.clear();
    this.monthViewData = [];
    this.shifts = [];

    let observableBatch = [];
    observableBatch.push(this.getShifts(undefined, startDate, endDate, {publishedOnly: true}));
    observableBatch.push(this.getOpenShifts(startDate, endDate));

    Observable.forkJoin(observableBatch).subscribe(result => {
      this.shiftsObservableResponse = result[0];
      this.openShiftsObservableResponse = result[1];

      if (this.shiftsObservableResponse && this.shiftsObservableResponse !== null && this.shiftsObservableResponse.employees !== undefined) {

        this.defineMonthShifts(this.shiftsObservableResponse, this.openShiftsObservableResponse);
        this.defineMonthOpenShifts(this.openShiftsObservableResponse);
        //
      }

    })
  }

  /**
   * Defining month shifts to be seen on calendar
   * @param shiftsResponse
   * @param openShiftsResponse
   */
  public defineMonthShifts(shiftsResponse, openShiftsResponse) {
    this.currentEvents = [];
    let shifts = [];

    let employee = shiftsResponse.employees[0];
    let shiftsKeys = Object.keys(employee.shifts);
    shiftsKeys.forEach(key => {
      let currentShifts = employee.shifts[key];
      for (let i in currentShifts) {
        let count = 0;
        if (currentShifts.hasOwnProperty(i)) {
          let shift = currentShifts[i];

          shift = this.defineShiftDropCancelStatus(shift, openShiftsResponse);

          if (!shift.delete && !shift.hiddenShift) {
            if (shifts[key] === undefined) {
              shifts[key] = [];
            }
            shifts[key].push(shift);
            count = shifts[key].length;
            console.log("************  COUNT  ***************");
            console.log(count);

            let newDate = new Date(shift.shiftDate);

            for(let ev in this.currentEvents) {
              let currentEvent = this.currentEvents[ev];
              if(currentEvent.year === newDate.getFullYear() && currentEvent.month === newDate.getMonth() && currentEvent.date === newDate.getDate()) {
                console.log('EXISTS');
                this.currentEvents[ev]--;
              }
            }

            let dateObj = {
              year: newDate.getFullYear(),
              month: newDate.getMonth(),
              date: newDate.getDate(),
              color: 'purple',
              count: count
            };
            this.currentEvents.push(dateObj);
          }
        }
      }
      console.log(this.currentEvents);

    });

    if (employee.absences !== undefined) {
      let absences = employee.absences;
      console.log(absences);
      for (let i in absences) {
        let count = 0;
        if (absences.hasOwnProperty(i)) {
          let newDate = new Date(i);
          if (typeof absences[i] === 'object') {
            count = 1;
          } else {
            for(let ev in this.currentEvents) {
              let currentEvent = this.currentEvents[ev];
              if(currentEvent.year === newDate.getFullYear() && currentEvent.month === newDate.getMonth() && currentEvent.date === newDate.getDate()) {
                console.log('EXISTS');
                if(currentEvent.color === 'purple') {
                  count = currentEvent.count + absences[i].length;
                  currentEvent--;
                } else {
                  currentEvent--;
                  count = absences[i].length;
                }
              }
            }
            // count = absences[i].length;
            console.log(this.currentEvents);
          }

          let dateObj = {
            year: newDate.getFullYear(),
            month: newDate.getMonth(),
            date: newDate.getDate(),
            color: 'red',
            count: count
          };
          this.currentEvents.push(dateObj);
        }
      }
    }
  }


  public defineMonthAbsences(absences) {

  }

  public defineMonthOpenShifts(openShiftResponse) {
    // this.currentEvents = [];
    let count = 0;
    if (openShiftResponse && openShiftResponse.length > 0) {
      let openShiftsObj = {};
      openShiftResponse.forEach(shift => {
        if (shift.requestType === 'CAN_WORK' && shift.shiftType === 'OPEN_SHIFT' && shift.status === 'PENDING') {
          openShiftsObj[shift.date] = shift;
          openShiftsObj[shift.date].has = true;
          let newDate = new Date(shift.date);
          if(typeof openShiftsObj[shift.date] === 'object') {
            for(let i in this.currentEvents) {
              let currentEvent = this.currentEvents[i];
              if(currentEvent.year === newDate.getFullYear() && currentEvent.month === newDate.getMonth() && currentEvent.date === newDate.getDate()) {
                // exists, add to existing one
                count = currentEvent.count + 1;
                currentEvent.count = count;
              } else {
                count = 1;
              }
            }
          } else {
            count = openShiftsObj[shift.date].length;
          }

          let dateObj = {
            year: newDate.getFullYear(),
            month: newDate.getMonth(),
            date: newDate.getDate(),
            color: 'green',
            count: count
          };
          this.currentEvents.push(dateObj);
          console.log(this.currentEvents);
          console.log(openShiftsObj[shift.date]);
          this.shifts.push(openShiftsObj[shift.date]);
        }
      });
    }
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
    if (this.employee.shifts !== undefined) {
      for (let i in this.employee.shifts) {
        if (this.employee.shifts.hasOwnProperty(i)) {
          let item = this.employee.shifts[i];

          for (let j in item) {
            if (item.hasOwnProperty(j)) {
              let shift = item[j];
              shift = this.defineShiftDropCancelStatus(shift, openShifts);
              shift = this.checkIfShiftLocked(days, shift);

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
                for (let k in this.weekDays) {
                  let weekDay = this.weekDays[k];
                  if (weekDay.date === shift.shiftDate) {
                    this.weekDays[k].has = true;
                  }
                }
                // this.weekDays[shift.shiftDate] = {has: true};
                shift.monthText = date.toLocaleString('en-US', {month: this.monthTextFormat});
                shift.dayText = date.toLocaleString('en-US', {weekday: this.dayTextFormat});
                shift.dayNumber = date.getDate();

                this.shifts.push(shift);
              }
            }
          }
        }
      }
    }
  }

  public defineAbsences(shifts, openShifts, days, absences) {
    for (let i in this.weekDays) {
      let weekDay = this.weekDays[i];
      if (this.employee.absences[weekDay.date] !== undefined) {
        let absence = this.employee.absences[weekDay.date];
        for (let key in this.absenceTypes) {
          if (this.absenceTypes.hasOwnProperty(key)) {
            let absenceType = this.absenceTypes[key];
            if (absenceType.id === absence.absenceTypeId) {
              this.weekDays[i].has = true;
              let date = new Date(weekDay.date);
              this.shifts.push({
                title: absenceType.description,
                shiftDate: weekDay.date,
                monthText: date.toLocaleString('en-US', {month: this.monthTextFormat}),
                dayText: date.toLocaleString('en-US', {weekday: this.dayTextFormat}),
                dayNumber: date.getDate()
              });
            }
          }
        }
      }
      console.log('ABSENCES!!!!!');
    }
  }

  public defineOpenShifts(shifts, openShifts, days, absences) {
    console.log(openShifts);
    console.log(this.weekDays);
    for (let i in this.weekDays) {
      if (this.weekDays.hasOwnProperty(i)) {
        let weekDay = this.weekDays[i];

        for (let key in openShifts) {
          if (openShifts.hasOwnProperty(key)) {
            let openShift = openShifts[key];
            console.log(weekDay);
            console.log(openShift);
            if (openShift.date === weekDay.date && openShift.requestType === 'CAN_WORK' && openShift.shiftType === 'OPEN_SHIFT' && openShift.status === 'PENDING') {
              let date = new Date(weekDay.date);
              this.shifts.push({
                title: 'Request pending',
                openShift: true,
                shiftDate: weekDay.date,
                monthText: date.toLocaleString('en-US', {month: this.monthTextFormat}),
                dayText: date.toLocaleString('en-US', {weekday: this.dayTextFormat}),
                dayNumber: date.getDate()
              })
            }
          }
          console.log(this.shifts);
        }
      }
    }
  }

  public fillFullWeekWithData(shifts, openShifts, days, absences) {
    for (let i in this.weekDays) {
      if (this.weekDays.hasOwnProperty(i)) {
        let item = this.weekDays[i];

        if (!item.has) {
          let date = new Date(item.date);
          this.shifts.push({
            title: 'Day Off',
            shiftDate: item.date,
            monthText: date.toLocaleString('en-US', {month: this.monthTextFormat}),
            dayText: date.toLocaleString('en-US', {weekday: this.dayTextFormat}),
            dayNumber: date.getDate()
          })
        }
      }
    }
  }

  public loadEmployeeShiftsForSelectedDate(date) {
    let formattedDate = this.convertDateToLocale(date, 'yyyy-MM-dd');
    this.loadEmployeeShifts(formattedDate, undefined, undefined);
    if (this.shifts.length > 0) {
      for (let i in this.shifts) {
        if (this.shifts.hasOwnProperty(i)) {
          let shift = this.shifts[i];
          if (shift.id) {
            this.monthShift.push(shift);
          }
        }
      }
    }
    console.log(this.monthShift);
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

    this.loadEmployeeShifts(undefined, this.selectedRoster.startDate, this.selectedRoster.endDate);
  }

  public onDaySelect(event) {
    this.monthShift = [];
    this.weekDays = [];

    let date = new Date(event.year, event.month, event.date);
    this.shifts = [];
    this.loadEmployeeShiftsForSelectedDate(date);
  }

  public onMonthSelect(event) {
    this.shifts = [];
    // load month
    let monthStartDate = new Date(event.year, event.month, 1);
    let monthEndDate = new Date(event.year, event.month + 1, 0);
    this.loadEmployeeMonthShifts(this.convertDateToLocale(monthStartDate, 'yyyy-MM-dd'), this.convertDateToLocale(monthEndDate, 'yyyy-MM-dd'));
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
    return array.sort(function (a, b) {
      return new Date(a.shiftDate).getTime() - new Date(b.shiftDate).getTime();
    })
  }


}
