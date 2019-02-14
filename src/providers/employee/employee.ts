import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";
import {Transfer, FileUploadOptions, TransferObject} from "@ionic-native/transfer";
import {File} from "@ionic-native/file";

@Injectable()
export class EmployeeProvider {

  constructor(public http: HttpClient, public serverProvider: ServerProvider, private transfer: Transfer, private file: File) {
  }

  /**
   * Get employee
   * @param companyId
   * @param userId
   */
  public getEmployee(companyId, userId) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.get(this.serverProvider.getServerURL() + 'hrm/employees/' + userId + '?view=FULL', {headers: headers}).subscribe( (result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  // shifts
  public getAvailableShifts() {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/myAvailableShifts', {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  /**
   * not used
   * @param shiftType
   * @param shiftId
   */
  public getShiftDetails(shiftType: any, shiftId: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/shiftDetails/' + shiftType + '/' + shiftId, {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  /**
   * not used
   * @param personId
   */
  public getPersonShiftRequests(personId: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'hrm/shiftRequest/person/' + personId, {headers: headers}).subscribe((result: any) => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  /**
   * Saves persons data
   * @param companyId
   * @param person
   */
  public savePerson(companyId: any, person: any) {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'hrm/cm/' + companyId + '/employees', person, {headers: headers}).subscribe((result:any) => {
        resolve(result);
      }, error => {
        reject(JSON.stringify(error));
      })
    })
  }

  public uploadImage(params: any, employeeId: any) {
    return new Promise((resolve, reject) => {
      if(params === undefined || params === null || params.file === undefined || params.file === null || params.file === '') {
        reject('Not all parameters are defined!');
      }

      if(params.companyId === undefined || params.companyId === null) {
        reject('CompanyId is not defined');
      }

      if(params.typeId === undefined || params.typeId === null) {
        reject('TypeId is not defined');
      }

      if(params.objectId === undefined || params.objectId === null) {
        reject('ObjectId is not defined');
      }

      if(employeeId === undefined || employeeId === null) {
        reject('EmployeeId is not defined');
      }

      let url = this.serverProvider.getServerURL() + 'hrm/employees/avatar/' + employeeId;

      let uploadOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: params.file.substr(params.file.lastIndexOf('/') + 1),
        mimeType: 'image/jpeg',
        headers: {
          'synergy-login-token': localStorage.getItem('accessToken')
        }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      fileTransfer.upload(params.file, url, uploadOptions).then((response) => {
        resolve(response);
      }, (err) => {
        reject(err);
      })
    })
  }

}
