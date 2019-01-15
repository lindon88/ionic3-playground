import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ServerProvider} from "../server/server";
import {NavController} from "ionic-angular";

@Injectable()
export class AuthenticationProvider {
  // vars
  private userInfo: any;
  public isValidToken: boolean;

  constructor(public http: HttpClient, private serverProvider: ServerProvider) {
  }

  /**
   * Post login data method
   * @param username
   * @param password
   */
  public login(username, password) {
    let headers = new Headers();
    return new Promise((resolve, reject) => {
      this.http.post(this.serverProvider.getServerURL() + 'RestWebServiceManager/login', {
        userName: username,
        password: password
      }).subscribe((result: any) => {
        console.log("AUTH RESULT");
        console.log(result);
        headers.set('synergy-login-token', result.loginToken);
        this.userInfo = {
          accessToken: result.loginToken,
          userRoles: result.permission.roles.length,
          allowedCompanies: result.permission.allowedCompanies,
          corporateId: result.permission.allowedCompanies[0].corporateId,
          userId: result.userId,
          userPIN: result.userPIN
        };
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        if (result.userPIN !== null || result.userPIN !== undefined) {
          localStorage.setItem('PIN', result.userPIN);
        }
        localStorage.setItem('username', result.username);
        localStorage.setItem('accessToken', result.loginToken);
        localStorage.setItem('currentCompanyId', result.permission.allowedCompanies[0].id);
        localStorage.setItem('currentCorporateId', result.permission.allowedCompanies[0].corporateId);
        localStorage.setItem('currentPersonId', result.userId);

        localStorage.setItem('serverUrl', this.serverProvider.getServerURL());

        resolve(this.userInfo);
      })
    })
  }

  public logout() {
    let headers = {'synergy-login-token': localStorage.getItem('accessToken')};

    return new Promise((resolve, reject) => {
      this.http.post(this.serverProvider.getServerURL() + 'RestWebServiceManager/logout', {}, {headers: headers}).subscribe((result) => {
        if (localStorage.getItem('accessToken')) {
          localStorage.removeItem('accessToken');
        }

        if (localStorage.getItem('PIN')) {
          localStorage.removeItem('PIN');
        }

        if (localStorage.getItem('currentCompanyId')) {
          localStorage.removeItem('currentCompanyId');
        }

        if (localStorage.getItem('currentCorporateId')) {
          localStorage.removeItem('currentCorporateId');
        }

        if (localStorage.getItem('currentPersonId')) {
          localStorage.removeItem('currentPersonId');
        }

        if (localStorage.getItem('userInfo')) {
          localStorage.removeItem('userInfo');
        }
        this.userInfo = null;
        resolve(result);
      }, (error) => {
        reject(error);
      })
    });
  }

  /**
   * Is authenticated
   * @param nav
   */
  public isAuth(nav: NavController) {
    return this.validateToken().then(isValid => {
      console.log(isValid);
      if(isValid === false) {
        localStorage.removeItem('accessToken');
      }
      return isValid;
    });
  }

  /**
   * Set isValidToken based on token validation
   */
  validateToken() {
    return new Promise((resolve, reject) => {
      this.isTokenValid().then((response: any) => {
        console.log(response.valid);
        return resolve(response.valid);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Token validation
   */
  public isTokenValid() {
    let token = localStorage.getItem('accessToken');
    let headers = {'Content-Type': 'application/json'};
    return new Promise((resolve, reject) => {
      this.http.post(this.serverProvider.getServerURL() + 'security/loginToken/verify', token, {headers: headers}).subscribe((response: any) => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * Reset password
   * @param email
   */
  public resetPassword(email) {
    let req = {email: email};
    return new Promise((resolve, reject) => {
      this.http.put(this.serverProvider.getServerURL() + 'security/resetPassword', req).subscribe((result:any) => {
        resolve(result);
      }, error => {
        reject(error);
      })
    })
  }
}
