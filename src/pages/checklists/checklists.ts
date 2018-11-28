import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  @ViewChild(Content) content: Content;
  public isAllowedEdit: boolean = false;
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public userInfo:any = JSON.parse(localStorage.getItem('userInfo'));
  public allowedOutlets:any = this.userInfo.allowedCompanies;

  // date vars
  // public datePipe: DatePipe;
  private now: any = new Date();
  private nowMinusFourHours: any = new Date(this.now.getTime() - 14400000);

  public tasks: any;
  public item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public workflowProvider: WorkflowProvider) {
    console.log("loading tasks....");
    // this.loadTasks();
  }

  ionViewDidEnter() {
    this.loadTasks();
  }

  public loadTasks() {
    // show loading

    // get workflow
    let datePipe: DatePipe = new DatePipe('en-US');
    this.workflowProvider.getWorkflow(this.currentCompanyId, datePipe.transform(this.nowMinusFourHours, 'dd/MM/yyyy'), 'CHECK_LIST').then((data: any) => {
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

  public getCompletedTasksCount(task) {
    let count = 0;
    for(let i = 0; i < task.subtasks.length; i++) {
      if(task.subtasks[i].complete === true) {
        count++;
      }
    }
    return count;
  }

  public getProgressColor(task) {
    let progressColor = '#eaeaea';
    if(this.getCompletedTasksCount(task) > 0) {
      progressColor = '#3fb6df';
    }
    return progressColor;
  }

  public openTasksView(task) {
    if (task === undefined || task === null) {
      return;
    }
    this.navCtrl.push("checklist-subtasks", {'companyId': this.currentCompanyId, 'taskId': task.id, 'task': task});
    // console.log(task);
  }

}
