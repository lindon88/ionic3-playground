import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AbsenceProvider} from "../../../providers/absence/absence";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {LoadingProvider} from "../../../providers/loading/loading";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-add-absence',
  templateUrl: 'add-absence.html',
})
export class AddAbsencePage {
  // vars
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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public authProvider: AuthenticationProvider, private absenceProvider: AbsenceProvider, private formBuilder: FormBuilder, public loadingProvider: LoadingProvider) {
    // form validation (only required is needed)
    this.absenceTypeForm = this.formBuilder.group({
      selectedAbsenceField: ['', Validators.required],
      startDateField: ['', Validators.required],
      endDateField: ['', Validators.required],
      absenceReasonText: ['']
    })
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
   * When page loaded, load absence types
   */
  ionViewDidLoad() {
    this.getAbsenceTypes();
  }

  /**
   * Navigate back to absences page
   */
  public goToAbsences() {
    this.navCtrl.setRoot("AbsencePage");
  }

  /**
   * Load absence types
   */
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

  /**
   * Add absence method
   */
  public addAbsence() {
    let request = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.absenceReason.text,
      absenceTypeId: this.selected.absence
    };
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
