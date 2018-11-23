import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";

declare let window: any;

@Injectable()
export class ServerProvider {
  public serverUrl: string = 'http://api.synergysuite.net/rest/';
  public devServerUrl: string = 'http://lbapi.synergysuite.net/rest/';
  public sandboxServerUrl: string = 'http://sandbox.synergysuite.net/rest/';
  public originalServerUrl: string = 'http://api.synergysuite.net/rest/';
  public originalDevServerUrl: string = 'http://api-dev.synergysuite.net/rest';

  public timeout: number = 2000; // timeout checking connection
  public connectionScoreMax: number = 200; // max value to use when calculating connection score
  public devMode: any = null;

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
  }

  private isDeveloperMode () {
    if (!window.cordova) return true;
    if (this.devMode == null) {
      let tmp = localStorage.getItem('developerMode');
      this.devMode = (tmp != null && tmp == 'true');
    }
    return this.devMode;
  }

  public getServerURL () {
    if (this.isDeveloperMode()) {
      return this.serverUrl;
    } else {
      return this.devServerUrl;
    }
  }

  public getSandboxURL () {
    return this.sandboxServerUrl;
  }

  public getOriginServerURL () {
    return this.originalServerUrl;
  }

  public getOriginDevServerURL () {
    return this.originalDevServerUrl;
  }

  public setServerUrl (url: string) {
    this.serverUrl = url;
  }

  public setDevServerUrl (url: string) {
    this.devServerUrl = url;
  }

  public checkConnection () {
    let result = {
      connected: false,
      ping: null,
      status: "UNKNOWN",
      connectionScore: 0
    };
    return new Promise((resolve, reject) => {
      this.ping().then((data: any) => {
        if (data.success) {
          result.connected = true;
          result.ping = data.duration;

          if (data.duration >= this.connectionScoreMax) {
            result.connectionScore = 0;
            result.status = "BAD";
          } else {
            let tmp = this.connectionScoreMax - data.duration;
            let percent = Math.floor((tmp / this.connectionScoreMax) * 100);
            result.connectionScore = percent;

            if (percent > 90) {
              result.status = "EXCELLENT";
            } else if (percent > 70) {
              result.status = "GOOD";
            } else if (percent > 50) {
              result.status = "OK";
            } else if (percent > 30) {
              result.status = "POOR";
            } else {
              result.status = "BAD";
            }
          }
        } else {
          result.connected = false;
          result.status = "NOT CONNECTED";
          result.connectionScore = 0;
        }
        resolve(result);
      });
    })

  }

  public ping () {
    let result = {
      start : new Date().getTime(),
      end: null,
      duration: null,
      success: false
    };
    return new Promise((resolve, reject) => {
      this.http.get(this.getServerURL() + 'server/ping', {'responseType':'text'}).timeout(this.timeout).subscribe(data => {
        if (data == "OK") {
          result.end = new Date().getTime();
          result.duration = result.end - result.start;
          result.success = true;
        } else {
          result.end = new Date().getTime();
          result.duration = result.end - result.start;
          result.success = false;
        }
        resolve(result);
      });
    });

  }

  public checkConnectionAndContinue (connectedFunction: any, disconnectedFunction: any) {
    /**
     * This method allows a pair functions to be supplied and the correct one will run based on the connection state (connected / not connected)
     * If not connected a popup will appear with the message: Unable to communicate with server. Please ensure you are online and try again.
     * When calling the callbacks it will pass the connection object in case the callback wants to do further connection based actions.
     */
    let connection = this.checkConnection();
    connection.then((connectionStatus) => {
      if (connectedFunction != null) {
        connectedFunction(connectionStatus);
      } else {
        let alert = this.alertCtrl.create({
          title: "Cannot connect to Server",
          subTitle: "Unable to communicate with server. Please ensure you are online and try again"
        });
        if (disconnectedFunction != null) {
          alert.present();
          disconnectedFunction(connectionStatus);
        }
      }
    })
  }

  public toggleDeveloperMode() {
    let isDev = this.isDeveloperMode();
    let newVal = !isDev;
    localStorage.setItem('developerMode', String(newVal));
  }

}
