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
}
