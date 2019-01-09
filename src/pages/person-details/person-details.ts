import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";
import {CountryProvider} from "../../providers/country/country";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

/**
 * Generated class for the PersonDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-person-details',
  templateUrl: 'person-details.html',
})
export class PersonDetailsPage {
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  // retrieved person object
  public person: any;

  // page details form
  public user_email: string;
  public home_phone: string;
  public mobile_phone: string;
  public address_line_1: string;
  public address_line_2: string;
  public state_country: string;
  public country: any;
  public emergency_contact_name: string;
  public emergency_phone: any;
  public emergency_address: any;
  public emergency_city: any;
  public emergency_country: any;
  public emergency_medical_conditions: any;

  // countries
  public countries: any = [];

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public authProvider: AuthenticationProvider, public navParams: NavParams, private employeeProvider: EmployeeProvider, private countryProvider: CountryProvider) {
  }

  @ViewChild(Content) content: Content;

  scrollToTop() {
    this.content.scrollToTop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonDetailsPage');
    this.getCountries();
    this.getEmployee();
  }

  /**
   * Auth Guard
   */
  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authProvider.isAuth(this.navCtrl).then((response) => {
        console.log(response);
        if(response === false) {
          this.viewCtrl.dismiss();
          setTimeout(() => {
            this.navCtrl.setRoot("LoginPage");
          }, 0);
        }
        resolve(response);
      }, error => {
        reject(error);
      }).catch(error => {
        console.log(error);
      })
    });
  }

  public getCountries() {
    this.countryProvider.getCountries().then((result: any) => {
      console.log(result);
      this.countries = result;
    })
  }

  public getEmployee() {
    this.employeeProvider.getEmployee(this.currentCompanyId, this.currentPersonId).then((result: any) => {
      this.person = result;
      console.log(result);
      if (result) {
        this.user_email = result.email;
        this.home_phone = result.phone;
        this.mobile_phone = result.mobile;
        this.address_line_1 = result.address1;
        this.address_line_2 = result.address2;
        this.state_country = result.address4;
        this.country = result.country['id'];

        this.emergency_contact_name = result.emergencyContactName;
        this.emergency_address = result.emergencyAddress1;
        this.emergency_phone = result.emergencyContactPhone;
        this.emergency_country = result.country['id'];
        this.emergency_city = result.emergencyAddress4;
        this.emergency_medical_conditions = result.medicalConditions;
      }
    }).catch(error => {
      console.log(error);
    })
  }


  public savePerson() {
    // todo: Nemanja add to person object rest of the data
    let person = {
      id: this.currentPersonId,
      companyId: this.currentCompanyId,
      email: this.user_email,
      phone: this.home_phone,
      mobile: this.mobile_phone,
      address1: this.address_line_1,
      address2: this.address_line_2,
      address4: this.state_country,
      country: {id: this.country},
      emergencyContactName: this.emergency_contact_name,
      emergencyAddress1: this.emergency_address,
      emergencyContactPhone: this.emergency_phone,
      emergencyAddress4: this.emergency_city,
      medicalConditions: this.emergency_medical_conditions
    };

    // merge scopes values with person
    const obj = {...this.person, ...person};
    this.employeeProvider.savePerson(this.currentCompanyId, obj).then((result: any) => {
      console.log(result);
      this.user_email = result.email;
      this.home_phone = result.phone;
      this.mobile_phone = result.mobile;
      this.address_line_1 = result.address1;
      this.address_line_2 = result.address2;
      this.state_country = result.address4;
      this.country = result.country['id'];

      this.emergency_contact_name = result.emergencyContactName;
      this.emergency_address = result.emergencyAddress1;
      this.emergency_phone = result.emergencyContactPhone;
      this.emergency_country = result.country['id'];
      this.emergency_city = result.emergencyAddress4;
      this.emergency_medical_conditions = result.medicalConditions;
    });

    this.scrollToTop();

  }

  goToMainProfile() {
    this.navCtrl.pop();
  }
}
