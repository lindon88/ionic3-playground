import { Component } from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController, NavParams} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";
import {AbsenceProvider} from "../../providers/absence/absence";
import {DatePipe} from "@angular/common";
import {ModalDropAbsencePage} from "./modal-drop-absence/modal-drop-absence";
import {ModalAbsenceNotePage} from "./modal-absence-note/modal-absence-note";
import {LoadingProvider} from "../../providers/loading/loading";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-absence',
  templateUrl: 'absence.html',
})
export class AbsencePage {

  // vars
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public selectedCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');
  public absenceTypes: any = [];
  public absenceTypesHash: any = {};
  public selected: any = {};
  public pastAbsenceRequests: any = [];
  public myAbsenceRequests: any = [];
  public toggleCurrent: boolean = false;
  public togglePast: boolean = false;

  public currentDate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public employeeProvider: EmployeeProvider, public absenceProvider: AbsenceProvider, public modalCtrl: ModalController, public menuCtrl: MenuController, public loadingProvider: LoadingProvider, public authProvider: AuthenticationProvider) {
    this.currentDate = new Date();
  }

  // Auth Guard
  ionViewCanEnter() {
    const isAllowed = this.authProvider.isAuth(this.navCtrl);
    if(isAllowed === false) {
      setTimeout(() => {
        this.navCtrl.setRoot('LoginPage');
      }, 0);
    }
    return isAllowed;
  }

  ionViewDidLoad() {
    this.loadingProvider.showLoader();
    const datePipe = new DatePipe('en-US');
    this.currentDate = datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log(this.currentDate);
    this.getAbsenceTypes();
    this.getMyRequests();
    this.loadingProvider.hideLoader();
  }

  // START: methods for enabling swipe back on this page
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END: methods for enabling swipe back for this page

  /**
   * Load absence types for company
   */
  public getAbsenceTypes() {
    this.absenceProvider.getCompanyAbsenceTypes(this.selectedCompanyId).then((data: any) => {
      for(let i = 0; i < data.length; i++) {
        let absence = data[i];
        this.absenceTypes.push(absence);
      }
      console.log("==== absence types list ====");
      console.log(this.absenceTypes);
      this.selected.absence = this.absenceTypes[0].id;
      console.log(this.selected.absence);

      for(let j = 0; j < this.absenceTypes.length; j++) {
        let absenceType = this.absenceTypes[j];
        this.absenceTypesHash[absenceType.id] = absenceType;
      }
    });
  }

  /**
   * Load persons previous absences
   */
  public getPastPersonAbsences() {
    this.pastAbsenceRequests = [];
    this.absenceProvider.getPastPersonAbsences(this.currentPersonId).then((data: any) => {
      console.log("===pastAbsenceRequest", data);
      for(let i = 0; i < data.length; i++) {
        let pastAbsenceRequest = data[i];
        if(!pastAbsenceRequest.cancelledByEmployee) {
          this.pastAbsenceRequests.push(pastAbsenceRequest);
        }
      }
      console.log(this.pastAbsenceRequests);
    }).catch(error => {
      console.log(error);
    })
  }

  /**
   * Load current persons absences
   */
  public getCurrentPersonAbsences() {
    this.myAbsenceRequests = [];
    this.absenceProvider.getCurrentPersonAbsences(this.currentPersonId).then((data: any) => {
      console.log("===AbsenceRequests", data);
      for(let i = 0; i < data.length; i++) {
        let absenceRequest = data[i];
        if(!absenceRequest.cancelledByEmployee) {
          this.myAbsenceRequests.push(absenceRequest);
        }
      }
    }).catch(error => {
      console.log(error);
    })
  }

  /**
   * Load current and past absencess
   */
  public getMyRequests() {
    // start loading
    this.getCurrentPersonAbsences();
    this.getPastPersonAbsences();
    // stop loading
  }

  /**
   * Show current
   * @param type
   */
  public toggleC(type) {
    this.toggleCurrent = !type;
    console.log(this.toggleCurrent);
  }

  /**
   * Show past
   * @param type
   */
  public toggleP(type) {
    this.togglePast = !type;
    console.log(this.togglePast);
    console.log(this.absenceTypesHash);
  }

  /**
   * Convert date to format 'yyyy/MM/dd'
   * locale should be working, but setting it to en-GB, because sr-SR was not recognized in testing
   * @param date
   */
  public convertDateToLocale(date) {
    // const locale = window.navigator.language;
    const locale = 'en-GB';
    date = new Date(date);
    const datePipe = new DatePipe(locale);
    return datePipe.transform(date, 'yyyy/MM/dd');
  }

  /**
   * Modal for dropping absence request
   * @param request
   * @param description
   */
  public dropAbsenceRequestPopup(request, description) {
    let modal = this.modalCtrl.create(ModalDropAbsencePage, {request: request, description: description }, {cssClass: 'drop-modal-absence' });
    modal.onDidDismiss(data => {
      console.log(data);
      this.loadingProvider.showLoader();
      if(data === undefined || data === null || data === '') return;
      this.absenceProvider.cancelAbsenceRequest(this.currentPersonId, data).then((response: any) => {
        console.log(response);
        this.getMyRequests();
      }).catch((error) => {
        console.log(error);
        alert("Delete failed!");
      });
      this.loadingProvider.hideLoader();
    });
    modal.present();
  }

  /**
   * Navigate to add absence page
   */
  public goToAddAbsence() {
    this.navCtrl.setRoot("AddAbsencePage");
  }

  /**
   * Display note as modal
   * @param request
   */
  public showNote(request) {
    let modal = this.modalCtrl.create(ModalAbsenceNotePage, {absenceRequest: request}, {cssClass: 'drop-modal-absence'});
    modal.present();
  }
}
