import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

/**
 * Generated class for the PayrollPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payroll',
  templateUrl: 'payroll.html',
})
export class PayrollPage {

  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  // retrieved person object
  public person: any;

  public ac_name: string;
  public ac_number: string;
  public sort_number: string;
  public routing_bic: string;
  public iban: string;
  public bank_name: string;
  public bank_street_address: string;
  public bank_address: string;
  public bank_city: string;
  public bank_phone: string;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider, public employeeProvider: EmployeeProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayrollPage');
    this.getEmployee();
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

  public getEmployee() {
    this.employeeProvider.getEmployee(this.currentCompanyId, this.currentPersonId).then((result: any) => {
      this.person = result;
      console.log(result);
      if (result) {
        this.ac_name = result.bankAccountName;
        this.ac_number = result.bankAccountNumber;
        this.sort_number = result.bankSortCode;
        this.routing_bic = result.bankBIC;
        this.iban = result.bankIBAN;
        this.bank_name = result.bankName;
        this.bank_street_address = result.bankAddress1;
        this.bank_address = result.bankAddress2;
        this.bank_city = result.bankAddress3;
        this.bank_phone = result.bankPhone;
      }
    }).catch(error => {
      console.log(error);
    })
  }

  public savePayroll() {
    let payroll = {
      id: this.currentPersonId,
      companyId: this.currentCompanyId,
      bankAccountName: this.ac_name,
      bankAccountNumber: this.ac_number,
      bankSortCode: this.sort_number,
      bankBIC: this.routing_bic,
      bankIBAN: this.iban,
      bankName: this.bank_name,
      bankAddress1: this.bank_street_address,
      bankAddress2: this.bank_address,
      bankAddress3: this.bank_city,
      bankPhone: this.bank_phone
    };

    const obj = {...this.person, ...payroll};
    console.log(obj);

    this.employeeProvider.savePerson(this.currentCompanyId, obj).then((result: any) => {
      console.log(result);
      this.ac_name = result.bankAccountName;
      this.ac_number = result.bankAccountNumber;
      this.sort_number = result.bankSortCode;
      this.routing_bic = result.bankBIC;
      this.iban = result.bankIBAN;
      this.bank_name = result.bankName;
      this.bank_street_address = result.bankAddress1;
      this.bank_address = result.bankAddress2;
      this.bank_city = result.bankAddress3;
      this.bank_phone = result.bankPhone;
    });
    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  goToMainProfile() {
    this.navCtrl.pop();
  }

}
