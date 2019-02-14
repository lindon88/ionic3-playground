import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  Content,
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {EmployeeProvider} from "../../../providers/employee/employee";
import {CountryProvider} from "../../../providers/country/country";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ServerProvider} from "../../../providers/server/server";

/**
 * Generated class for the PersonDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-person-details',
  templateUrl: 'person-details.html',
})
export class PersonDetailsPage {
  public currentPersonId: any = localStorage.getItem('currentPersonId');
  public currentCompanyId: any = localStorage.getItem('currentCompanyId');
  public currentCorporateId: any = localStorage.getItem('currentCorporateId');

  // retrieved person object
  public person: any;

  // page details form
  public user_email: string;
  public home_phone: string;
  public mobile_phone: string;
  public address_line_1: string;
  public address_line_2: string;
  public state_country: string;
  public country: any;
  public emergency_contact_name: string;
  public emergency_phone: any;
  public emergency_address: any;
  public emergency_city: any;
  public emergency_country: any;
  public emergency_medical_conditions: any;

  public avatarURL: string;

  // countries
  public countries: any = [];

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public viewCtrl: ViewController, public actionSheetCtrl: ActionSheetController, public authProvider: AuthenticationProvider, public navParams: NavParams, private employeeProvider: EmployeeProvider, private countryProvider: CountryProvider, private camera: Camera, public serverProvider: ServerProvider) {
  }

  @ViewChild(Content) content: Content;

  /**
   * Scroll to top
   */
  scrollToTop() {
    this.content.scrollToTop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonDetailsPage');
    this.getCountries();
    this.getEmployee();
  }

  /**
   * Auth Guard
   */
  async ionViewCanEnter() {
    let canEnter = await this.canEnter();
    if(canEnter === false) {
      this.navCtrl.setRoot('LoginPage');
      return;
    }
  }

  canEnter() {
    return new Promise((resolve, reject) => {
      return this.authProvider.isAuth(this.navCtrl).then((response) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  public getCountries() {
    this.countryProvider.getCountries().then((result: any) => {
      console.log(result);
      this.countries = result;
    })
  }

  /**
   * Get current employee
   */
  public getEmployee() {
    this.employeeProvider.getEmployee(this.currentCompanyId, this.currentPersonId).then((result: any) => {
      this.person = result;
      console.log(result);
      if (result) {
        let date = new Date();
        let timestamp = date.getTime();
        this.avatarURL = null;
        if(result.avatarUrl === undefined || result.avatarUrl === null) {
          this.avatarURL = this.serverProvider.getServerURL() + 'hrm/employees/avatar/' + this.currentPersonId + "?v=" + timestamp;
        } else {
          this.avatarURL = this.serverProvider.getServerURL() + 'hrm/employees/avatar/' + this.currentPersonId + "?v=" + timestamp;
        }
        this.user_email = result.email;
        this.home_phone = result.phone;
        this.mobile_phone = result.mobile;
        this.address_line_1 = result.address1;
        this.address_line_2 = result.address2;
        this.state_country = result.address4;
        this.country = result.country['id'];

        this.emergency_contact_name = result.emergencyContactName;
        this.emergency_address = result.emergencyAddress1;
        this.emergency_phone = result.emergencyContactPhone;
        this.emergency_country = result.country['id'];
        this.emergency_city = result.emergencyAddress4;
        this.emergency_medical_conditions = result.medicalConditions;
      }
    }).catch(error => {
      console.log(error);
    })
  }

  /**
   * Save employee data
   */
  public savePerson() {
    let person = {
      id: this.currentPersonId,
      companyId: this.currentCompanyId,
      email: this.user_email,
      phone: this.home_phone,
      mobile: this.mobile_phone,
      address1: this.address_line_1,
      address2: this.address_line_2,
      address4: this.state_country,
      country: {id: this.country},
      emergencyContactName: this.emergency_contact_name,
      emergencyAddress1: this.emergency_address,
      emergencyContactPhone: this.emergency_phone,
      emergencyAddress4: this.emergency_city,
      medicalConditions: this.emergency_medical_conditions
    };

    // merge scopes values with person
    const obj = {...this.person, ...person};
    this.employeeProvider.savePerson(this.currentCompanyId, obj).then((result: any) => {
      console.log(result);
      this.user_email = result.email;
      this.home_phone = result.phone;
      this.mobile_phone = result.mobile;
      this.address_line_1 = result.address1;
      this.address_line_2 = result.address2;
      this.state_country = result.address4;
      this.country = result.country['id'];

      this.emergency_contact_name = result.emergencyContactName;
      this.emergency_address = result.emergencyAddress1;
      this.emergency_phone = result.emergencyContactPhone;
      this.emergency_country = result.country['id'];
      this.emergency_city = result.emergencyAddress4;
      this.emergency_medical_conditions = result.medicalConditions;
    });

    this.scrollToTop();

  }

  public openCameraMenu() {
    const cameraDialog = this.actionSheetCtrl.create({
      title: "Select an option",
      buttons: [
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => {
            console.log('Take a picture');
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Browse from gallery',
          icon: 'images',
          handler: () => {
            console.log('Browse from gallery');
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    cameraDialog.present();
  }

  public takePicture(type) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: type,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log('Picture taken');
      let params = {
        file: imageData,
        companyId: this.currentCompanyId,
        typeId: 100,
        objectId: this.person,
        subTypeId: 10001
      };

      this.employeeProvider.uploadImage(params, this.currentPersonId).then((response) => {
        this.getEmployee();
        let alert = this.alertCtrl.create({
          title: 'Success',
          message: 'Photo successfully uploaded!'
        });
        alert.present().then(() => {
          this.getEmployee();
        });
      }, (err) => {
        console.log(err);
      })
    }, (err) => {
      console.log('Camera issue: ' + err);
    })
  }

  /**
   * Go to main page for user profile
   */
  goToMainProfile() {
    this.navCtrl.pop();
  }
}
