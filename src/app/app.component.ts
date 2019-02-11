import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {LandingPage} from "../pages/landing/landing";
import {EmployeeProvider} from "../providers/employee/employee";
import {CompanyProvider} from "../providers/company/company";
import {AuthenticationProvider} from "../providers/authentication/authentication";
import {MessagesProvider} from "../providers/messages/messages";
import {ApplicationVersionProvider} from "../providers/application-version/application-version";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  // root page should be landing page
  rootPage: any = LandingPage;
  public user: any;
  public company: any;
  pages: Array<{ icon: string, title: string, component: any, click: any }>;
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  public companyId: any = localStorage.getItem('currentCompanyId');

  public userName: string = '';
  public companies: any;

  public notificationsBadge: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, menuCtrl: MenuController, public appVersion: ApplicationVersionProvider, public events: Events, public employeeProvider: EmployeeProvider, public companyProvider: CompanyProvider, public authenticationProvider: AuthenticationProvider, public messagesProvider: MessagesProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      menuCtrl.swipeEnable(false, 'menu1');
      this.events.subscribe('user:logged', (userinfo) => {
        console.log(userinfo);
      });
      if(this.userInfo === null || this.userInfo === undefined) {
        this.events.subscribe('user:logged', (userInfo) => {
          this.userInfo = userInfo;
          console.log(this.userInfo);
          this.getUserInfo();
          this.getAllowedCompanies();
          this.getMessages();
        });
      } else {
        this.getUserInfo();
        this.getAllowedCompanies();
        this.getMessages();
      }
    });
    // define pages for sidemenu
    this.pages = [
      {icon: 'fa fa-tachometer', title: 'Dashboard', component: 'HomePage', click: null},
      {icon: 'fa fa-calendar', title: 'My Schedule', component: "EmployeeShiftsPage", click: null},
      {icon: 'fa fa-calendar-o', title: 'Open Shifts', component: "EmployeeOpenShiftPage", click: null},
      {icon: 'fa fa-sun-o', title: 'Absence Requests', component: "AbsencePage", click: null},
      {icon: 'fa fa-user', title: 'Personal Profile', component: 'ProfilePage', click: null},
      {icon: 'fa fa-check-square-o', title: 'Checklists', component: "ChecklistsPage", click: null},
      {icon: 'fa fa-envelope', title: 'Notifications', component: "NotificationsPage", click: null},
      {icon: 'fa fa-sign-out', title: 'Log out', component: null, click: 'logout'}
    ];

    if(this.appVersion.getVersion() === undefined || this.appVersion.getVersion() === null) {
      this.appVersion.setDefault();
    }


  }

  ngOnInit() {
  }

  /**
   * Open page from menu
   * @param page
   */
  openPage(page) {
    if (page.click === 'logout') {
      this.logout();
      return;
    }
    this.navCtrl.setRoot(page.component);
  }

  /**
   * Get user info
   */
  public getUserInfo() {
    if (this.userInfo !== undefined && this.userInfo !== null) {
      this.employeeProvider.getEmployee(null, this.userInfo.userId).then((res) => {
        this.user = res;
        console.log(this.user);
      }, (err) => {
        console.error(err);
      })
    } else {
      this.events.subscribe('user:logged', (userInfo) => {
        this.userInfo = userInfo;
        this.employeeProvider.getEmployee(null, this.userInfo.userId).then((res) => {
          this.user = res;
          console.log(this.user);
        }, (err) => {
          console.error(err);
        })
      })
    }
  }

  /**
   * Logout method
   */
  public logout() {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }

    if (localStorage.getItem('PIN')) {
      localStorage.removeItem('PIN');
    }

    if (localStorage.getItem('currentCompanyId')) {
      localStorage.removeItem('currentCompanyId');
    }

    if (localStorage.getItem('currentCorporateId')) {
      localStorage.removeItem('currentCorporateId');
    }

    if (localStorage.getItem('currentPersonId')) {
      localStorage.removeItem('currentPersonId');
    }

    if (localStorage.getItem('userInfo')) {
      localStorage.removeItem('userInfo');
    }
    this.userInfo = null;

    this.navCtrl.setRoot("LoginPage");
  }

  public getMessages() {
    if(this.userInfo !== undefined && this.userInfo !== null) {
      let userId = this.userInfo.userId;
      this.messagesProvider.getMessages(userId).then((result) => {
        console.log(result);
        this.notificationsBadge = this.countNotifications(result);
        this.events.publish('notifications:received', this.notificationsBadge);
        console.log(this.notificationsBadge);
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.events.subscribe('user:logged', (userInfo) => {
        this.userInfo = userInfo;
        let userId = this.userInfo.userId;
        this.messagesProvider.getMessages(userId).then((result) => {
          console.log(result);
          this.notificationsBadge = this.countNotifications(result);
          this.events.publish('notifications:received', this.notificationsBadge);
          console.log(this.notificationsBadge);
        }).catch(error => {
          console.log(error);
        });
      })
    }
  }

  public countNotifications(data) {
    let count: any = 0;
    if (data !== null && data.items !== undefined && data.items.length !== 0) {
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].messageRead === false) {
          count++;
        }
      }
    }
    if (count > 99) {
      count = '99+';
    }
    return count;
  }

  /**
   * Get allowed companies
   */
  public getAllowedCompanies() {
    if (this.userInfo !== undefined && this.userInfo !== null) {
      this.companyProvider.getAllAllowedCompanies(this.userInfo.userId).then((res) => {
        this.companies = res;
        for (let i = 0; i < this.companies.length; i++) {
          if (this.companies[i].id === this.companyId) {
            this.company = this.companies[i];
            console.log(this.company);
          }
        }
      }, (err) => {
        console.error(err);
      })
    } else {
      this.events.subscribe('user:logged', (userInfo) => {
        this.userInfo = userInfo;
        this.companyProvider.getAllAllowedCompanies(this.userInfo.userId).then((res) => {
          this.companies = res;
          for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].id === this.companyId) {
              this.company = this.companies[i];
              console.log(this.company);
            }
          }
        }, (err) => {
          console.error(err);
        })
      })
    }
  }

  public gotoProfile() {
    this.navCtrl.push('ProfilePage');
  }
}

