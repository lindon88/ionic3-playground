import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {WorkflowProvider} from "../../../providers/workflow/workflow";
import {CompanyProvider} from "../../../providers/company/company";
import {DatePipe} from "@angular/common";
import {ChecklistSubtasksPopoverPage} from "../checklist-subtasks-popover/checklist-subtasks-popover";
import {ModalTaskNotePage} from "./modal-task-note/modal-task-note";
import {Navbar} from "ionic-angular";
import {LoadingProvider} from "../../../providers/loading/loading";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";


@IonicPage({
  name: 'checklist-subtasks',
  segment: 'checklist-subtasks/:companyId/:taskId'
})
@Component({
  selector: 'page-checklist-subtasks',
  templateUrl: 'checklist-subtasks.html',
})
export class ChecklistSubtasksPage {

  // vars
  public task: any;
  public title: string;
  public subtasks: any;
  public showView: boolean;
  public currentPersonId: string;
  public currentDate: any;
  public showAll: boolean = true;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public authProvider: AuthenticationProvider, public workflowProvider: WorkflowProvider, public companyProvider: CompanyProvider, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public loadingProvider: LoadingProvider) {

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

  /**
   * On page load, load workflow tasks
   */
  ionViewDidLoad() {
    this.loadingProvider.showLoader();
    this.getCompanyCurrentDate(this.navParams.get('companyId')).then(dateSuccess => {
      console.log(dateSuccess);
      this.loadWorkflowTask(this.navParams.get('taskId'), this.navParams.get('companyId'), dateSuccess);
      this.currentDate = dateSuccess;
    }, dateError => {
      console.log(dateError);
      this.loadWorkflowTask(this.navParams.get('taskId'), this.navParams.get('companyId'), dateError);
      this.currentDate = dateError;
    });
    this.task = this.navParams.get('task');
    console.log(this.task);
    if(this.task === null || this.task === undefined || this.task.length === 0) {
      this.task = this.loadWorkflowTask(this.navParams.get('taskId'), this.navParams.get('companyId'), this.currentDate);
    }
    this.currentPersonId = localStorage.getItem('currentPersonId');
    this.loadingProvider.hideLoader();
  }

  /**
   * Navigate back to checklist
   */
  public goToChecklist() {
    this.navCtrl.setRoot("ChecklistsPage");
  }

  /**
   * Load workflow method
   * @param taskId
   * @param companyId
   * @param date
   */
  public loadWorkflowTask(taskId, companyId, date) {
    this.workflowProvider.getWorkflowTask(taskId, companyId, date).then( (data) => {
      this.task = data;
      this.title = this.task.name;
      this.subtasks = this.formatTasksList(this.task.subtasks);
      this.showView = true;
      console.log(this.subtasks);
    })
  }

  /**
   * Format list of tasks
   * @param tasks
   */
  public formatTasksList(tasks) {
    if(tasks === undefined || tasks === null) {
      return;
    }
    if(tasks.length > 0) {
      for(let i = 0; i < tasks.length; i++) {
        this.formatTask(tasks[i]);
      }
    }
    return tasks;
  }

  /**
   * Accordion - show or hide task description
   * @param task
   */
  public toggleExpanded(task) {
    this.subtasks.map((item) => {
      if(task.id === item.id) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = false;
      }
    });
    return !task.expanded;
  }

  /**
   * Toggle task status
   * @param task
   * @param i
   */
  public toggleTaskStatus(task, i) {
    if(!task.complete) {
      task.complete = true;
      this.workflowProvider.markComplete(task.id, this.currentPersonId, this.navParams.get('companyId'), this.currentDate).then((response: any) => {
        console.log(response);
        console.log(i);
        if(response) {
          this.subtasks[i] = response;
          console.log(this.subtasks);
          console.log('UPDATED STATUS');
        }
      }, error => {
        task.complete = false;
      })
    } else {
      task.complete = false;
      // mark task as uncomplete
      this.workflowProvider.markUncomplete(task.id, task.resultId, this.currentPersonId, this.navParams.get('companyId'), this.currentDate).then(result => {
        let expanded = task.expanded;
        task.expanded = expanded;
      }, error => {
        task.complete = true;
      })
    }
  }

  /**
   * Show filter popup
   * @param event
   */
  public showFilterMenu(event) {
    let popover = this.popoverCtrl.create(ChecklistSubtasksPopoverPage, { 'checked':this.showAll }, { cssClass: ' custom-popover ' });
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      console.log("Selected data: " + data);
      // if backdrop is clicked
      if(data !== null) {
        this.showAll = data;
      } else {
        return;
      }
    })
  }

  /**
   * Add note for task
   * @param data
   * @param i
   */
  public addTaskNote(data, i) {
    let modal = this.modalCtrl.create(ModalTaskNotePage, { 'data': data }, {cssClass: 'select-modal' });
    modal.onDidDismiss(data => {
      if(data === null || data === undefined) return;
      if(data.note === null || data.note === undefined || data.note === '') return;
      this.workflowProvider.setSubtaskResultNote(data.task.id, this.currentPersonId, this.navParams.get('companyId'), this.currentDate, data.note).then(result => {
        console.log(result);
        this.subtasks[i] = result;
      }, error => {
        console.error(error);
      })
    });
    modal.present();
  }

  /**
   * Format single tasks
   * @param task
   */
  private formatTask(task) {
    // define status class
    task.statusClass = task.complete ? 'ion-checkmark-circled orange' : 'ion-ios-circle-outline';

    if(task.expanded === undefined) {
      task.expanded = false;
    }

    task.show = !task.complete;
    // define it it's needed to show launch button
    task.showLaunchButton = !(task.wizard === undefined || task.wizard === null || task.wizard.appLink === undefined || task.wizard.appLink === null);
    return task;
  }

  /**
   * Get current business date
   * @param companyId
   */
  private getCompanyCurrentDate(companyId) {
    return this.companyProvider.getCurrentBusinessDate(companyId).then((data: any) => {
      // console.log(this.datePipe.transform(new Date(data), 'dd/MM/yyyy'));
      let datePipe: DatePipe = new DatePipe('en-US');
      let currentDate = new Date(data);
      const formattedDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
      return formattedDate;
    }, (error: any) => {
      let currentDate = Date.now();
      let datePipe: DatePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
      return formattedDate;
    })
  }
}
