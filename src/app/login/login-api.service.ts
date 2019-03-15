import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class LoginApiService {
  loginUrl = `${API_URL}/login`;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('LoginApiService');
  }

   /** POST: login to the server*/
   login(username: String, password: String) {
    console.log(username, password)
    return this.http.post(this.loginUrl, { username, password })
  }
        
        
}