import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class WorkflowProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {

  }

  public getWorkflow(companyId, date, type) {

    const params = {
      companyId: companyId,
      type: type,
      date: date
    };

    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'workflow/getWorkflow', {params: params, headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  public getWorkflowTask(taskId, companyId, date) {

    const params = {
      workflowTaskId: taskId,
      companyId: companyId,
      date: date
    };

    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'workflow/getWorkflowTask', {params: params, headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * Set task as completed
   * @param subtaskId
   * @param userId
   * @param companyId
   * @param date
   */
  public markComplete(subtaskId, userId, companyId, date) {
    const params = {
      subtaskId: subtaskId,
      companyId: companyId,
      personId: userId,
      date: date
    };
    let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
    return new Promise((resolve, reject) => {
      this.http.get(this.serverProvider.getServerURL() + 'workflow/markComplete', {params: params, headers: headers}).subscribe(data => {
        if(data !== undefined){
          resolve(data);
        } else {
          resolve(null);
        }
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Set task complete = false
   * @param subtaskId
   * @param subtaskResultId
   * @param userId
   * @param companyId
   * @param date
   */
  public markUncomplete(subtaskId, subtaskResultId, userId, companyId, date) {
    const params = {
      subtaskId: subtaskId,
      subtaskResultId: subtaskResultId,
      companyId: companyId,
      personId: userId,
      date: date
    };
    let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
    return new Promise((resolve, reject) => {
      this.http.get(this.serverProvider.getServerURL() + 'workflow/markUncomplete', {params: params, headers: headers}).subscribe(result => {
        if(result !== undefined) {
          resolve(result);
        } else {
          resolve(null);
        }
      }, error => {
        reject(error);
      })
    })
  }

  public setSubtaskResultNote(subtaskId, userId, companyId, date, note) {
    const params = {
      subtaskId: subtaskId,
      companyId: companyId,
      personId: userId,
      note: note,
      date: date
    };

    let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
    return new Promise((resolve, reject) => {
      this.http.get(this.serverProvider.getServerURL() + 'workflow/setSubtaskResultNote', {params: params, headers: headers}).subscribe(result => {
        if(result !== undefined) {
          resolve(result);
        } else {
          resolve(null);
        }
      }, error => {
        reject(error);
      })
    })
  }
}
