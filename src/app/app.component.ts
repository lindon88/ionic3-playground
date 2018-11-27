import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from "../pages/landing/landing";
import {EmployeeProvider} from "../providers/employee/employee";
import {CompanyProvider} from "../providers/company/company";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  // root page should be landing page
  rootPage:any = LandingPage;
  public user: any;
  public company; any;
  pages: Array<{icon_name: any, icon_md: any, title: string, component: any}>;
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  public companyId: any = localStorage.getItem('currentCompanyId');

  public userName: string = '';
  public companies: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, menuCtrl: MenuController, public events: Events, public employeeProvider: EmployeeProvider, public companyProvider: CompanyProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      menuCtrl.swipeEnable(false, 'menu1');
      this.getUserInfo();
      this.getAllowedCompanies();
    });
    // define pages for sidemenu
    this.pages = [
      { icon_name: 'calendar', icon_md: 'md-calendar', title: 'Open Shifts', component: "EmployeeOpenShiftPage" }
    ];
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
  }

  public getUserInfo() {
    this.employeeProvider.getEmployee(null, this.userInfo.userId).then((res) => {
      this.user = res;
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
    }, (err) => {
      console.error(err);
    })
  }
}

