import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";
import {AbsenceProvider} from "../../providers/absence/absence";
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import {ModalDropAbsencePage} from "./modal-drop-absence/modal-drop-absence";

@IonicPage()
@Component({
  selector: 'page-absence',
  templateUrl: 'absence.html',
})
export class AbsencePage {
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public selectedCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');
  public absenceTypes: any = [];
  public absenceTypesHash: any = {};
  public selected: any = {};
  public absenceStartDate: any = new Date();
  public absenceEndDate: any = new Date();
  public pastAbsenceRequests: any = [];
  public myAbsenceRequests: any = [];
  public toggleCurrent: boolean = false;
  public togglePast: boolean = false;

  public currentDate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public employeeProvider: EmployeeProvider, public absenceProvider: AbsenceProvider, public modalCtrl: ModalController) {
    this.currentDate = new Date();
  }

  ionViewDidLoad() {
    const datePipe = new DatePipe('en-US');
    this.currentDate = datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log(this.currentDate);
    this.getAbsenceTypes();
    this.getMyRequests();

    console.log('ionViewDidLoad AbsencePage');
  }

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

  public getPastPersonAbsences() {
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

  public getCurrentPersonAbsences() {
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

  public getMyRequests() {
    // start loading
    this.getCurrentPersonAbsences();
    this.getPastPersonAbsences();
    // stop loading
  }

  public toggleC(type) {
    this.toggleCurrent = !type;
    console.log(this.toggleCurrent);
  }

  public toggleP(type) {
    this.togglePast = !type;
    console.log(this.togglePast);
    console.log(this.absenceTypesHash);
  }

  public convertDateToLocale(date) {
    const locale = window.navigator.language;
    date = new Date(date);
    const datePipe = new DatePipe(locale);
    return datePipe.transform(date, 'yyyy/MM/dd');
  }

  public dropAbsenceRequestPopup() {
    let modal = this.modalCtrl.create(ModalDropAbsencePage, { }, {cssClass: 'drop-modal-absence' });
    modal.present();
  }
}
