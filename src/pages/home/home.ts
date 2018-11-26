import { Component } from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";
import {CompanyProvider} from "../../providers/company/company";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  public userName: string = '';
  public companies: any;
  public company: any;
  public companyId: any = localStorage.getItem('currentCompanyId');

  constructor(public navCtrl: NavController, public employeeProvider: EmployeeProvider, public companyProvider: CompanyProvider, public events: Events) {
    // this.navCtrl.setRoot("HomePage");
    console.log(this.userInfo);
    this.getUserInfo();
    this.getAllowedCompanies();
  }

  public getUserInfo() {
    this.employeeProvider.getEmployee(null, this.userInfo.userId).then((res) => {
      this.events.publish("user:received", res);
    }, (err) => {
      console.error(err);
    })
  }

  public getAllowedCompanies() {
    this.companyProvider.getAllAllowedCompanies(this.userInfo.userId).then( (res) => {
      this.companies = res;
      for(let i = 0; i < this.companies.length; i++) {
        if(this.companies[i].id === this.companyId) {
          this.company = this.companies[i];
          console.log(this.company);
        }
      }
    })
  }

}
