import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Device} from "@ionic-native/device/ngx";
import {MobileDeviceProvider} from "../mobile-device/mobile-device";

/**
 * Should be used to handle mobile device registration
 */

@Injectable()
export class RemoteDeviceProvider {

  public PUSH_NOTIFICATION_TOKEN: any = null;
  public IS_SUPPORTED_REMOTE_DEVICE: boolean = false;
  public APPLICATION_NAME: string = "COVER";

  constructor(public http: HttpClient, public device: Device, public mobileDeviceProvider: MobileDeviceProvider) {
  }

  private init() {
    if(window.cordova !== undefined && this.device !== undefined && this.device.uuid !== undefined) {
      this.IS_SUPPORTED_REMOTE_DEVICE = true;
      localStorage.setItem('mobile-device-uuid', this.device.uuid);
    }
  }

  /**
   * Return current device uuid
   */
  public getCurrentDeviceUUID() {
    if(!this.IS_SUPPORTED_REMOTE_DEVICE) {
      return 'browser';
    }
    return this.device.uuid;
  }

  /**
   * Get status if device is supported or not
   */
  public isSupported() {
    return this.IS_SUPPORTED_REMOTE_DEVICE;
  }

  /**
   * Verify or register mobile device object on remote server
   */
  public verifyRegisterRemoteDevice() {
    return new Promise((resolve, reject) => {
      if(!this.isSupported()) {
        reject(false);
      }

      // get current mobile device uuid
      const mobileDeviceUUID = this.getCurrentDeviceUUID();

      // check if defined mobile device uuid
      if(!mobileDeviceUUID) {
        reject(false);
      }

      // check if exists on backend
      this.mobileDeviceProvider.getMobileDeviceByUUID(mobileDeviceUUID, this.APPLICATION_NAME).then((response: any) => {
        if(response !== undefined && response !== null && response.id !== undefined) {
          localStorage.setItem('mobile-device-obj', JSON.stringify(response));

          // update remote device
        }
      })
    })
  }

  private updateRemoteDevice(device: any) {
    if(device.userId === undefined || device.deviceToken === undefined) {
      return;
    }

    let needUpdateDevice = false;
    let currentCompanyId = localStorage.getItem('currentCompanyId');
    let currentCorporateId = localStorage.getItem('currentCorporateId');
    let userId = localStorage.getItem('currentPersonId');

    if(device.deviceToken !== null && device.deviceToken === this.PUSH_NOTIFICATION_TOKEN && device.snsEndpoint !== undefined && device.snsEndpoint !== null && device.snsEndpoint !== '') {
      needUpdateDevice = false;
    }

    if(currentCompanyId !== device.companyId) {
      needUpdateDevice = true;
    }

    if(userId !== device.userId) {
      needUpdateDevice = true;
    }

    if(currentCorporateId !== device.corporateId) {
      needUpdateDevice = true;
    }

    if(!needUpdateDevice) {
      return;
    }
  }
}
