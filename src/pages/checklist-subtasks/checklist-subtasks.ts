import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {WorkflowProvider} from "../../providers/workflow/workflow";
import {CompanyProvider} from "../../providers/company/company";
import {DatePipe} from "@angular/common";
import {ChecklistSubtasksPopoverPage} from "../checklist-subtasks-popover/checklist-subtasks-popover";
import {ModalTaskNotePage} from "../modal-task-note/modal-task-note";
import {Navbar} from "ionic-angular";
import {ChecklistsPage} from "../checklists/checklists";

@IonicPage({
  name: 'checklist-subtasks',
  segment: 'checklist-subtasks/:companyId/:taskId'
})
@Component({
  selector: 'page-checklist-subtasks',
  templateUrl: 'checklist-subtasks.html',
})
export class ChecklistSubtasksPage {
  // @ViewChild(DatePipe) datePipe: DatePipe = new DatePipe('en-US');
  public task: any;
  title: string;
  subtasks: any;
  showView: boolean;
  currentPersonId: string;
  currentDate: any;
  public showAll: boolean = true;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public workflowProvider: WorkflowProvider, public companyProvider: CompanyProvider, public popoverCtrl: PopoverController, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
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

  }

  // Go back to checklist
  public goToChecklist() {
    this.navCtrl.setRoot("ChecklistsPage");
  }

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
        console.log('UPDATED STATUS!!!');
      }, error => {
        task.complete = true;
      })
    }
  }


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

  public addTaskNote(data, i) {
    let modal = this.modalCtrl.create(ModalTaskNotePage, { 'data': data }, {cssClass: 'select-modal' });
    modal.onDidDismiss(data => {
      console.log(data.task);
      console.log(data.note);
      console.log('task id: ' + data.task.id);
      console.log('person id: ' + this.currentPersonId);
      console.log('company id: ' + this.navParams.get('companyId'));
      console.log('current date: ' + this.currentDate);
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
    if(task.complete) {
      task.statusClass = 'ion-checkmark-circled orange';
    } else {
      task.statusClass = 'ion-ios-circle-outline';
    }

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
