import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Device} from "@ionic-native/device/ngx";

/**
 * Should be used to handle mobile device registration
 */

@Injectable()
export class RemoteDeviceProvider {

  public PUSH_NOTIFICATION_TOKEN: any = null;
  public IS_SUPPORTED_REMOTE_DEVICE: boolean = false;
  public APPLICATION_NAME: string = "COVER";

  constructor(public http: HttpClient, public device: Device) {
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
    })
  }


}
