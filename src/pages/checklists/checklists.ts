import {Component, ViewChild} from '@angular/core';
import {
  Content,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {WorkflowProvider} from "../../providers/workflow/workflow";
import {DatePipe} from "@angular/common";
import {ChecklistFilterPopoverPage} from "../checklist-filter-popover/checklist-filter-popover";

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

  public showAll: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public workflowProvider: WorkflowProvider, public popoverCtrl: PopoverController, public menuCtrl: MenuController, public loadingCtrl: LoadingController) {
    console.log("loading tasks....");
  }

  ionViewDidEnter() {
    this.loadTasks();
  }

  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }


  public loadTasks() {
    // get workflow
    let loading = this.loadingMethod();
    loading.present();
    let datePipe: DatePipe = new DatePipe('en-US');
    this.workflowProvider.getWorkflow(this.currentCompanyId, datePipe.transform(this.nowMinusFourHours, 'dd/MM/yyyy'), 'CHECK_LIST').then((data: any) => {
      console.log("GET SUCCESSFUL!");
      this.tasks = data;
      console.log(this.tasks);
    }, (error) => {
      console.log(error);
    });
    loading.dismiss();
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

  public showFilterMenu(event) {
    let popover = this.popoverCtrl.create(ChecklistFilterPopoverPage, {'checked': this.showAll}, {cssClass: ' custom-popover '});
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      console.log("Selected data: " + data);
      // if backdrop is clicked
      if (data !== null) {
        this.showAll = data;
      } else {
        return;
      }
    })
  }

  private loadingMethod() {
    return this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"><img src="assets/imgs/Gear_Set.svg" alt=""></div>
      </div>`,
    });
  }

}
