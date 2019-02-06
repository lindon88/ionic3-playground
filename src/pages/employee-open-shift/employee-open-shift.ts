import {Component, HostListener} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ShiftsProvider} from "../../providers/shifts/shifts";
import {Observable} from "rxjs";
import {ModalEosCancelPage} from "./modal-eos-cancel/modal-eos-cancel";
import {ModalEosSendPage} from "./modal-eos-send/modal-eos-send";
import {ModalEosSuccessPage} from "./modal-eos-success/modal-eos-success";
import {ModalEosErrorPage} from "./modal-eos-error/modal-eos-error";
import {LoadingProvider} from "../../providers/loading/loading";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {NotificationsCounterProvider} from "../../providers/notifications-counter/notifications-counter";
import {LocaleProvider} from "../../providers/locale/locale";

@IonicPage()
@Component({
  selector: 'page-employee-open-shift',
  templateUrl: 'employee-open-shift.html',
})
export class EmployeeOpenShiftPage {
  // vars

  // shift types
  OPEN_SHIFT: string = 'OPEN_SHIFT';
  SHIFT: string = 'SHIFT';

  // shift statuses
  PENDING: string = 'PENDING';
  APPROVED: string = 'APPROVED';
  REJECTED: string = 'REJECTED';
  CANCELLED: string = 'CANCELLED';

  // shift request types
  CAN_WORK: string = 'CAN_WORK';
  CANNOT_WORK: string = 'CANNOT_WORK';
  PREFER_NOT_WORK: string = 'PREFER_NOT_WORK';

  // current logged in user data
  currentPersonId: any;
  currentCompanyId: any;
  currentCorporateId: any;

  // list of shifts
  availableShifts: any;

  // screen width
  screenWidth: number = window.screen.width;
  public notificationsBadge: any;

  constructor(public navCtrl: NavController, public localeProvider: LocaleProvider, public notificationsCounter: NotificationsCounterProvider, public viewCtrl: ViewController, public navParams: NavParams, public authProvider: AuthenticationProvider, public shiftsProvider: ShiftsProvider, public modalCtrl: ModalController, private menuCtrl: MenuController, public loadingProvider: LoadingProvider) {
  }

  /**
   * Auth Guard
   */
  async ionViewCanEnter() {
    let canEnter = await this.canEnter();
    if(canEnter === false) {
      this.navCtrl.setRoot('LoginPage');
      return;
    }
  }

  canEnter() {
    return new Promise((resolve, reject) => {
      return this.authProvider.isAuth(this.navCtrl).then((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * If page loaded, load open shifts
   */
  ionViewDidLoad() {
    this.getNotificationsCount();
    this.currentPersonId = localStorage.getItem('currentPersonId');
    this.currentCompanyId = localStorage.getItem('currentCompanyId');
    this.currentCorporateId = localStorage.getItem('currentCorporateId');

    this.loadOpenShifts();
  }

  public getNotificationsCount() {
    this.notificationsCounter.getNotificationsCount().then((response: any) => {
      this.notificationsBadge = response;
    })
  }

  // START - Swipe back enable
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END - Swipe back disable

  /**
   * On resize should change screenWidth public var
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
  }

  /**
   * Load open shifts
   */
  public loadOpenShifts() {
    this.availableShifts = [];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    this.loadingProvider.showLoader();
    Observable.forkJoin(this.getMyAvailableShifts(this.localeProvider.convert(startDate, 'YYYY-MM-DD'), this.localeProvider.convert(endDate, 'YYYY-MM-DD')), this.getMyRequests(this.localeProvider.convert(startDate, 'YYYY-MM-DD'), this.localeProvider.convert(endDate, 'YYYY-MM-DD')))
      .subscribe(results => {
        console.log(results);
        const [availableShifts, requests] = results;
        // format shifts
        for(let i = 0; i < (<any>availableShifts).length; i++) {
          let item = availableShifts[i];
          if(requests && (<any>requests).length > 0) {
            for(let j = 0; j < (<any>requests).length; j++) {
              let request = requests[j];
              if(item.shiftId == request.shiftId) {
                item.status = request.status;
                item.requestType = request.requestType;
                item.requesterEmployee = request.requesterEmployee;
                item.requestId = request.id;
                (<any>requests).splice(j, 1);
                break;
              }
            }
          }
          this.formatShift(item);
          this.availableShifts.push(item);
        }
        // define other requests
        if((<any>requests).length > 0) {
          for(let k = 0; k < (<any>requests).length; k++) {
            let request = requests[k];
            this.fillRequestWithData(request).then(data => {
              this.formatShift(data);
              this.availableShifts.push(data);
            }, error => {
              console.log(error);
            })
          }
        }
      });
    this.loadingProvider.hideLoader();
    console.log(this.availableShifts);
  }

  /**
   * Modals for sending/canceling requests
   * @param shift
   */
  public onShiftClick(shift) {
    if(shift.showDrop !== undefined && shift.showDrop) {
      let modal = this.modalCtrl.create(ModalEosCancelPage, {data: shift}, {cssClass: 'cancelation-modal'});
      modal.onDidDismiss(data => {
        console.log(data);
        if(data === undefined || data === null) return;
        this.loadingProvider.showLoader();
        this.shiftsProvider.cancelRequest(data.shiftRequestId, data).then(result => {
          this.loadOpenShifts();
        }, error => {
          console.log(error);
        });
        this.loadingProvider.hideLoader();
      });
      modal.present();
    } else if (shift.showPickup !== undefined && shift.showPickup) {
      // sendOpenShiftRequest
      let modal = this.modalCtrl.create(ModalEosSendPage, {data: shift}, {cssClass: 'cancelation-modal'});
      modal.onDidDismiss(data => {
        console.log(data);
        if(data === null || data === undefined) return;
        this.loadingProvider.showLoader();
        this.shiftsProvider.sendRequest(data.requesterId, data).then((result:any) => {
          if(result.success) {
            let success = this.modalCtrl.create(ModalEosSuccessPage, {}, {cssClass: 'cancelation-modal'});
            success.present();
            success.onDidDismiss(data1 => {
              this.loadOpenShifts();
            })
          } else {
            let error = this.modalCtrl.create(ModalEosErrorPage, {}, {cssClass: 'cancelation-modal'});
            error.present();
          }
        }, error => {
          console.log(error);
        });
        this.loadingProvider.hideLoader();
      });
      modal.present();
    }
  }

  /**
   * Get available shifts
   * @param start
   * @param end
   */
  private getMyAvailableShifts(start, end) {
    return this.shiftsProvider.getMyAvailableShifts(start, end).then(result => {
      return result;
    });
  }

  /**
   * Get requests
   * @param start
   * @param end
   */
  private getMyRequests(start, end) {
    return this.shiftsProvider.getMyRequests(start, end).then(result => {
      return result;
    });
  }

  /**
   * Formats data for displaying
   * @param shift
   */
  private formatShift(shift) {
    if(!shift.shiftDate) {
      shift.shiftDate = shift.date;
    }
    const date = new Date(shift.shiftDate);
    // let locale = "en-us";
    let locale = this.localeProvider.getDeviceLocale();
    let day_num = date.getDate();
    shift.dayNumber = day_num;

    if(window.screen.width <= 460) {
      shift.monthText = date.toLocaleString(locale, {month:"short"});
      shift.dayText = date.toLocaleString(locale, {weekday:"short"});
    } else {
      let month = date.toLocaleString(locale, {month:"long"});
      let day = date.toLocaleString(locale, {weekday:"long"});

      shift.monthText = month;
      shift.dayText = day;
    }

    if(shift.status === undefined && shift.requestType === undefined && shift.shiftType === this.OPEN_SHIFT) {
      shift.tab = 1;
      shift.showPickup = true;
      shift.badgeClass = 'badge-green';
      shift.badgeText = 'Open Shift';
    }

    if(shift.status !== undefined && shift.requestType !== undefined) {
      if(shift.status === this.PENDING) {
        shift.showDrop = true;
        shift.badgeClass = 'badge-orange';
        if (shift.requestType === this.CAN_WORK) {
          shift.tab = 1;
          shift.badgeText = 'Pickup Pending';
        } else {
          shift.tab = 2;
          shift.badgeText = 'Drop Pending';
        }
      }
      if(shift.status === this.APPROVED) {
        shift.badgeClass = 'badge-green';
        if(shift.requestType === this.CAN_WORK) {
          shift.tab = 1;
          shift.badgeText = 'Pickup Approved';
        } else {
          shift.tab = 2;
          shift.badgeText = 'Drop Approved';
        }
      }

      if(shift.status === this.CANCELLED || shift.status === this.REJECTED) {
        shift.badgeClass = 'badge-red';
        if(shift.requestType === this.CAN_WORK) {
          shift.tab = 1;
          shift.badgeText = 'Pickup Cancelled';
        } else {
          shift.tab = 2;
          shift.badgeText = 'Drop Cancelled';
        }
      }
    }
  }

  /**
   * Assigns changed data
   * @param request
   */
  private fillRequestWithData(request) {
    return this.shiftsProvider.getShiftDetails(request.shiftType, request.shiftId).then(result => {
      // const newRequest = Object.assign(request, result);
      const newRequest = {...request, ...result};
      newRequest.requestId = request.id;
      return newRequest;
    }, error => {
      console.log(error);
    })
  }

  /**
   * Convert date to specified format
   * ex. this.convertDateToLocale(new Date(), 'yyyy-MM-dd')
   * @param date
   * @param format
   */
  public convertDateToLocale(date, format) {
    // const locale = window.navigator.language;
    //
    // const locale = 'en-GB';
    // date = new Date(date);
    // const datePipe = new DatePipe(locale);
    // return datePipe.transform(date, format);
    return this.localeProvider.convert(date, format);
  }
}
