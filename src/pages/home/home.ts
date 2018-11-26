import { Component } from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {EmployeeProvider} from "../../providers/employee/employee";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  public userName: string = '';

  constructor(public navCtrl: NavController, public employeeProvider: EmployeeProvider, public events: Events) {
    // this.navCtrl.setRoot("HomePage");
    console.log(this.userInfo);
    this.getUserInfo();
  }

  public getUserInfo() {
    this.employeeProvider.getEmployee(null, this.userInfo.userId).then((res) => {
      this.events.publish("user:received", res);
    }, (err) => {
      console.error(err);
    })
  }

}
