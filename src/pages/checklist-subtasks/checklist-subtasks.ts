import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WorkflowProvider} from "../../providers/workflow/workflow";
import {CompanyProvider} from "../../providers/company/company";
import {DatePipe} from "@angular/common";

/**
 * Generated class for the ChecklistSubtasksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public workflowProvider: WorkflowProvider, public companyProvider: CompanyProvider) {

  }

  ionViewDidLoad() {
    this.getCompanyCurrentDate(this.navParams.get('companyId')).then(dateSuccess => {
      console.log(dateSuccess);
      this.loadWorkflowTask(this.navParams.get('taskId'), this.navParams.get('companyId'), dateSuccess);
    }, dateError => {
      console.log(dateError);
      this.loadWorkflowTask(this.navParams.get('taskId'), this.navParams.get('companyId'), dateError);
    });
    this.task = this.navParams.get('task');
    console.log(this.task);
    if(this.task === null || this.task === undefined || this.task.length === 0) {
      this.navCtrl.setRoot("ChecklistsPage");
    }
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

  public toggleTaskStatus(task) {
    if(!task.complete) {
      task.complete = true;

    }
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
