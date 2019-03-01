import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import {  Observable } from "rxjs";
import { UserService } from './user.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor( private userService :UserService) { }
  isRefreshingToken: boolean = false;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    let currentUser = this.userService.getCurrentUser();
    let token = '';
    if (currentUser) {
      token = currentUser.accessToken;
    }
    return next.handle(this.addTokenToRequest(request, token));;
    
  }
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}
