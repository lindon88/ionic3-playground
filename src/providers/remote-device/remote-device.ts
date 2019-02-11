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
          this.updateRemoteDevice(response);
          resolve(response);
        }

        // register new device
        this.registerNewDevice(mobileDeviceUUID).then((res) => {
          if(res) {
            localStorage.setItem('mobile-device-obj', JSON.stringify(res));
            resolve(res);
          }
        }, error => {
          reject(error);
        })
      }, error => {
        reject(error);
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
    let appVersion = localStorage.getItem('version');

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

    if(appVersion !== device.synergyAppVersion) {
      needUpdateDevice = true;
    }

    if(!needUpdateDevice) {
      return;
    }

    device.userId = userId;
    device.deviceToken = this.PUSH_NOTIFICATION_TOKEN;
    device.companyId = currentCompanyId;
    device.corporateId = currentCorporateId;
    device.lastAccessTime = new Date();
    device.synergyAppVersion = appVersion;

    this.mobileDeviceProvider.updateMobileDevice(device.id, device).then((response: any) => {
      localStorage.setItem('mobile-device-obj', JSON.stringify(response));
    }, error => {
      console.log(error);
    })
  }

  private registerNewDevice(deviceId: any) {
    return new Promise((resolve, reject) => {
      let device = {
        deviceIdentifier: deviceId,
        synergyApp: this.APPLICATION_NAME,
        createTime: new Date(),
        corporateId: localStorage.getItem('currentCorporateId'),
        companyId: localStorage.getItem('currentCompanyId'),
        userId: localStorage.getItem('currentPersonId'),
        synergyAppVersion: localStorage.getItem('version'),
        devicePlatform: this.device.platform,
        deviceModel: this.device.model,
        deviceToken: this.PUSH_NOTIFICATION_TOKEN,
        snsEndpoint: null,
        lastAccessTime: new Date(),
        blacklisted: null
      };

      this.mobileDeviceProvider.createNewMobileDevice(device).then((response: any) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  public isRegistered() {
    if(!this.isSupported()) {
      return false;
    }

    const deviceUUID = this.getCurrentDeviceUUID();
    if(!deviceUUID) {
      return false;
    }

    let mobileDeviceObj = JSON.parse(localStorage.getItem('mobile-device-obj'));
    return !(!mobileDeviceObj || mobileDeviceObj.id === undefined || mobileDeviceObj.deviceIdentifier === undefined || mobileDeviceObj.deviceIdentifier !== deviceUUID);
  }

  public getDeviceObject() {
    const device = JSON.parse(localStorage.getItem('mobile-device-obj'));
    if(!device || device.id === undefined) {
      return null;
    }
    return device;
  }

  public setPushNotificationToken(token: any) {
    if(!token) {
      return;
    }
    this.PUSH_NOTIFICATION_TOKEN = token;
    localStorage.setItem('pushToken', token);
  }
}
