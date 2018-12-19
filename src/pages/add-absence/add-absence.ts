import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AbsenceProvider} from "../../providers/absence/absence";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {LoadingProvider} from "../../providers/loading/loading";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

/**
 * Generated class for the AddAbsencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-absence',
  templateUrl: 'add-absence.html',
})
export class AddAbsencePage {
  public absenceTypeForm: FormGroup;

  public startDate: any;
  public endDate: any;
  public absenceTypes: any = [];
  public absenceTypesHash: any = {};
  public absenceReason: any = {};
  public selected: any = {};
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public selectedCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider, private absenceProvider: AbsenceProvider, private formBuilder: FormBuilder, public loadingProvider: LoadingProvider) {
    this.absenceTypeForm = this.formBuilder.group({
      selectedAbsenceField: ['', Validators.required],
      startDateField: ['', Validators.required],
      endDateField: ['', Validators.required],
      absenceReasonText: ['']
    })
  }

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
    console.log('ionViewDidLoad AddAbsencePage');
    this.getAbsenceTypes();
  }

  // Go back to checklist
  public goToAbsences() {
    this.navCtrl.setRoot("AbsencePage");
  }

  public getAbsenceTypes() {
    this.loadingProvider.showLoader();
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
    this.loadingProvider.hideLoader();
  }

  public addAbsence() {
    console.log("***** End date: " + this.endDate);
    console.log("***** Start date: " + this.startDate);
    console.log("***** Selected Type: " + this.selected.absence);
    console.log("***** Reason Text: " + this.absenceReason.text);

    let request = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.absenceReason.text,
      absenceTypeId: this.selected.absence
    };
    console.log("**** Request: ");
    console.log(request);
    console.log("**** Person ID: ");
    console.log(this.currentPersonId);

    this.loadingProvider.showLoader();
    this.absenceProvider.addAbsence(request, this.currentPersonId).then((response:any) => {
      this.absenceReason = {text: ''};
      this.selected = {};
      this.goToAbsences();
    }).catch(error => {
      console.log(error);
    });
    this.loadingProvider.hideLoader();
  }

}
