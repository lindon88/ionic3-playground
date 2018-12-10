import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";

@Injectable()
export class AbsenceProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
  }

  /**
   * Get employee absences
   * @param employeeId
   * @param max
   * @param page
   */
  public getEmployeeAbsences(employeeId, max, page) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/absences/' + employeeId, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addAbsence(request: any, userId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'hrm/absences/personRequests/' + userId, {request: request}, {headers: header}).subscribe((result: any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Create employee absence
   * @param employeeId
   * @param absence
   */
  public createEmployeeAbsence(employeeId, absence) {
    return new Promise((resolve, reject) => {
      if (absence === undefined || absence === null) {
        reject("Absence request is needed!");
      }

      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'hrm/absences/' + employeeId, {absence: absence}, {headers: header}).subscribe((response: any) => {
        if (response.data !== undefined) {
          resolve(response.data);
          return;
        }
        resolve([]);
      }, error => {
        reject(error);
      });
    })
  }

  public deleteEmployeeAbsence(employeeId, absenceId) {
    return new Promise((resolve, reject) => {
      if ((employeeId === undefined || employeeId === null) || (absenceId === undefined || absenceId === null)) {
        reject("Parameters employeeId and/or absenceId were not passed!");
      }
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.delete(this.serverProvider.getServerURL() + 'hrm/absences/' + employeeId + '/' + absenceId, {headers: header}).subscribe((response: any) => {
        if (response.data !== undefined) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      }, error => {
        reject(error);
      })
    })
  }

  public getCompanyAbsenceTypes(companyId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/absences/type/company/' + companyId, {headers: header}).subscribe((response: any) => {
        if(response.data !== undefined) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      }, error => {
        reject(error);
      })
    })
  }

  public getPastPersonAbsences(personId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/absences/personRequests/' + personId + '/past', {headers: header}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  public getCurrentPersonAbsences(personId) {
    return new Promise((resolve, reject) => {
      let header = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/absences/personRequests/' + personId + '/upcoming', {headers: header}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }



}
