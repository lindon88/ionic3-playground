import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WorkflowProvider} from "../../providers/workflow/workflow";
import {DatePipe} from "@angular/common";

/**
 * Generated class for the ChecklistsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checklists',
  templateUrl: 'checklists.html',
})
export class ChecklistsPage {
  @ViewChild(DatePipe) datePipe: DatePipe = new DatePipe('en-US');
  public isAllowedEdit: boolean = false;
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public userInfo:any = JSON.parse(localStorage.getItem('userInfo'));
  public allowedOutlets:any = this.userInfo.allowedCompanies;

  // date vars
  // public datePipe: DatePipe;
  private now: any = new Date();
  private nowMinusFourHours: any = new Date(this.now.getTime() - 14400000);

  public tasks: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public workflowProvider: WorkflowProvider) {
    console.log("loading tasks....");
    this.loadTasks();
  }

  public loadTasks() {
    // show loading

    // get workflow
    this.workflowProvider.getWorkflow(this.currentCompanyId, this.datePipe.transform(this.nowMinusFourHours, 'dd/MM/yyyy'), 'CHECK_LIST').then((data: any) => {
      console.log("GET SUCCESSFUL!");
      this.tasks = data;
      console.log(this.tasks);
    }, (error) => {
      console.log(error);
    })
  }

  public onOutletChange(selectedCompany) {
    this.currentCompanyId = selectedCompany;
    this.loadTasks();
  }

}
