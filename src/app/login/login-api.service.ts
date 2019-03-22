import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class LoginApiService {
  loginUrl = `${API_URL}/login`;
  logoutUrl = `${API_URL}/logout`
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('LoginApiService');
  }


   // POST: login to the server
   login(username: String, password: String) {
    let formData: FormData = new FormData()
    formData.append('Username', String(username))
    formData.append('Password', String(password))
    return this.http.post<any>(this.loginUrl, formData, {withCredentials: true})
    .pipe(
      catchError(this.handleError('login'))
    );  
  }

  // GET: logout from the server
  logout() {
    return this.http.get<any>(this.logoutUrl, {withCredentials: true})
    .pipe(
      catchError(this.handleError('logout'))
    );  
  }
        
        
}