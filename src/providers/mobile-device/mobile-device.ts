import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerProvider} from "../server/server";



@Injectable()
export class MobileDeviceProvider {
  public ENDPOINT = null;

  constructor(public http: HttpClient, public serverProvider: ServerProvider) {
    console.log('Hello MobileDeviceProvider Provider');
  }

  /**
   * Get list of all mobile devices
   */
  public getMobileDevices() {
    return new Promise((resolve, reject) => {
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'mobile-device/all', {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get mobile devices by corporate
   * @param corporateId
   */
  public getMobileDevicesByCorporate(corporateId: any) {
    return new Promise((resolve, reject) => {
      if(corporateId === undefined || corporateId === null) {
        reject('Corporate ID is not defined');
      }
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'mobile-device/corporate/' + corporateId, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get mobile devices by company
   * @param companyId
   */
  public getMobileDevicesByCompany(companyId: any) {
    return new Promise((resolve, reject) => {
      if(companyId === undefined || companyId === null) {
        reject('Company ID is not defined');
      }
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'mobile-device/company/' + companyId, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get mobile device by id
   * @param id
   */
  public getMobileDevice(id: any) {
    return new Promise((resolve, reject) => {
      if(id === undefined || id === null) {
        reject('ID is not defined');
      }
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.get(this.serverProvider.getServerURL() + 'mobile-device/' + id, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Get mobile device by uuid
   * @param uuid
   * @param application
   */
  public getMobileDeviceByUUID(uuid, application) {
    return new Promise((resolve, reject) => {
      if(uuid === undefined || uuid === null) {
        reject('UUID is not defined');
      }
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      let params = {
        application: application
      };

      this.http.get(this.serverProvider.getServerURL() + 'mobile-device/uuid/' + uuid, {headers: headers, params: params, responseType: 'text'}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Create new mobile device
   * @param device
   */
  public createNewMobileDevice(device) {
    return new Promise((resolve, reject) => {
      if(device === undefined || device === null) {
        reject('Device object is not defined');
      }
      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};
      this.http.post(this.serverProvider.getServerURL() + 'mobile-device/', device, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Update existing mobile device
   * @param id
   * @param device
   */
  public updateMobileDevice(id: any, device: any) {
    return new Promise((resolve, reject) => {
      if(id === undefined || id === null) {
        reject('Id is not defined');
      }

      if(device === undefined || device === null) {
        reject('Device object is not defined');
      }

      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.put(this.serverProvider.getServerURL() + 'mobile-device/' + id, device, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Delete existing mobile device
   * @param id
   */
  public deleteMobileDevice(id: any) {
    return new Promise((resolve, reject) => {
      if(id === undefined || id === null) {
        reject('Id is not defined');
      }

      let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

      this.http.delete(this.serverProvider.getServerURL() + 'mobile-device/' + id, {headers: headers}).subscribe((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

}
