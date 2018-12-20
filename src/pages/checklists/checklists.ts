import {Component, ViewChild} from '@angular/core';
import {
  Content,
  IonicPage,
  MenuController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {WorkflowProvider} from "../../providers/workflow/workflow";
import {DatePipe} from "@angular/common";
import {ChecklistFilterPopoverPage} from "../checklist-filter-popover/checklist-filter-popover";
import {LoadingProvider} from "../../providers/loading/loading";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-checklists',
  templateUrl: 'checklists.html',
})
export class ChecklistsPage {
  // vars
  @ViewChild(DatePipe) datePipe: DatePipe = new DatePipe('en-US');
  @ViewChild(Content) content: Content;
  public isAllowedEdit: boolean = false;
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public userInfo:any = JSON.parse(localStorage.getItem('userInfo'));
  public allowedOutlets:any;

  // date vars
  // public datePipe: DatePipe;
  private now: any = new Date();
  private nowMinusFourHours: any = new Date(this.now.getTime() - 14400000);

  public tasks: any;
  public item: any;

  public showAll: boolean = true;

  public isValidToken: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider, public workflowProvider: WorkflowProvider, public popoverCtrl: PopoverController, public menuCtrl: MenuController, public loadingProvider: LoadingProvider) {
    console.log("loading tasks....");
  }

  /**
   * Auth Guard
   */
  ionViewCanEnter() {
    const isAllowed = this.authProvider.isAuth(this.navCtrl);
    if(isAllowed === false) {
      setTimeout(() => {
        this.navCtrl.setRoot('LoginPage');
      }, 0);
    }
    return isAllowed;
  }

  /**
   * If page is loaded, load tasks
   */
  ionViewDidLoad() {
    this.allowedOutlets = this.userInfo.allowedCompanies;
    this.loadTasks();
  }

  // START - Swipe back enable
  public ionViewWillEnter(): void {
    this.menuCtrl.swipeEnable(true, 'menu1');
  }

  public ionViewWillLeave(): void {
    this.menuCtrl.swipeEnable(false, 'menu1');
  }
  // END - Swipe back enable

  /**
   * Load tasks method
   */
  public loadTasks() {
    // get workflow
    this.loadingProvider.showLoader();
    let datePipe: DatePipe = new DatePipe('en-US');
    this.workflowProvider.getWorkflow(this.currentCompanyId, datePipe.transform(this.nowMinusFourHours, 'dd/MM/yyyy'), 'CHECK_LIST').then((data: any) => {
      this.tasks = data;
    }, (error) => {
      console.log(error);
    });
    this.loadingProvider.hideLoader();
  }

  /**
   * On outlet change method load task for selected company id
   */
  public onOutletChange() {
    console.log(this.currentCompanyId);
    this.loadTasks();
  }

  /**
   * Count completed tasks
   * @param task
   */
  public getCompletedTasksCount(task) {
    let count = 0;
    for(let i = 0; i < task.subtasks.length; i++) {
      if(task.subtasks[i].complete === true) {
        count++;
      }
    }
    return count;
  }

  /**
   * Get progress color
   * If tasks not completed, color is gray, else, it's blue
   * @param task
   */
  public getProgressColor(task) {
    let progressColor = '#eaeaea';
    if(this.getCompletedTasksCount(task) > 0) {
      progressColor = '#3fb6df';
    }
    return progressColor;
  }

  /**
   * Navigate to subtasks of selected task
   * @param task
   */
  public openTasksView(task) {
    if (task === undefined || task === null) {
      return;
    }
    this.navCtrl.push("checklist-subtasks", {'companyId': this.currentCompanyId, 'taskId': task.id, 'task': task});
  }

  /**
   * Show filter popup
   * @param event
   */
  public showFilterMenu(event) {
    let popover = this.popoverCtrl.create(ChecklistFilterPopoverPage, {'checked': this.showAll}, {cssClass: ' custom-popover '});
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      // if backdrop is clicked
      if (data !== null) {
        this.showAll = data;
      } else {
        return;
      }
    })
  }
}
