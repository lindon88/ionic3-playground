import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AbsenceProvider} from "../../providers/absence/absence";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";

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
  public selected: any = {};
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public selectedCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  constructor(public navCtrl: NavController, public navParams: NavParams, private absenceProvider: AbsenceProvider, private formBuilder: FormBuilder) {
    this.absenceTypeForm = this.formBuilder.group({
      selectedAbsenceField: ['', Validators.required],
      startDateField: ['', Validators.required],
      endDateField: ['', Validators.required]
    })
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

  public addAbsence() {
    console.log("***** End date: " + this.endDate);
    console.log("***** Start date: " + this.startDate);
    console.log("***** Selected Type: " + this.selected.absence);
  }

}
