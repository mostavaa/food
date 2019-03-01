import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Constants } from "./constants";
import { UserService } from "./user.service";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService, private userService: UserService) {

  }
  private isTokenExpired(token: string) {
    if (!token || token == "") return true
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return true;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    if (date === undefined) return true;
    return !(date.valueOf() > new Date().valueOf());
  }
  logout() {
    this.userService.clearCurrentUser();
  }
  isAuthenticated() {
    let user = this.userService.getCurrentUser();
    if (user) {
      return !this.isTokenExpired(user.accessToken);
    }
    return false;
  }
  //loginSubject: Subject<boolean> = new Subject<boolean>();
  signUp(username: string, password: string) {
    //this.loginSubject.next(false);
    let node = {
      Username: username,
      Password: password
    };
    return this.httpService.invoke({
      method: 'POST',
      url: Constants.websiteEndPoint,
      path: 'auth' + '/register',
      body: node,
    })
  }

  signIn(username: string, password: string) {
    //this.loginSubject.next(false);
    let node = {
       username,
       password
    };
    return this.httpService.invoke({
      method: 'POST',
      url: Constants.websiteEndPoint,
      path: 'Accounts' + '/Login',
      body: node,
    })
  }
}
