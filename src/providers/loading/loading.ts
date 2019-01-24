import {Injectable} from '@angular/core';
import {LoadingController} from "ionic-angular";

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {
  loader: any = null;

  constructor(private loadingCtrl: LoadingController) {
  }

  /**
   * Show loading
   */
  private showLoadingHandler() {
    if (this.loader === null) {
      this.loader = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<div class="custom-spinner-container">
          <div class="custom-spinner-box"><img src="assets/imgs/Gear_Set.svg" width="70px" height="70px" alt=""></div>
          </div>`,
      });
      this.loader.present();
    } else {
      this.loader.data.content = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<div class="custom-spinner-container">
          <div class="custom-spinner-box"><img src="assets/imgs/Gear_Set.svg" width="70px" height="70px" alt=""></div>
          </div>`,
      });
    }
  }

  /**
   * Hide loading
   */
  private hideLoadingHandler() {
    if(this.loader !== null) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  /**
   * public show
   */
  public showLoader() {
    this.showLoadingHandler();
  }

  /**
   * public hide
   */
  public hideLoader() {
    this.hideLoadingHandler();
  }

}
