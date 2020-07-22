import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { ApiService } from './api.service'


@Injectable()
export class LoginApiService {
  loginUrl: string;
  logoutUrl: string;
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('LoginApiService');
  }

  ngOnInit() {

  }

  // POST: login to the server
  login(username: String, password: String) {
    this.loginUrl = `${this.apiService.getUrl()}/login`
    let formData: FormData = new FormData()
    formData.append('Username', String(username))
    formData.append('Password', String(password))
    return this.http.post<any>(this.loginUrl, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('login'))
      );
  }

  // GET: logout from the server
  logout() {
    this.logoutUrl = `${this.apiService.getUrl()}/logout`
    return this.http.get<any>(this.logoutUrl, { withCredentials: true })
      .pipe(
        catchError(this.handleError('logout'))
      );
  }


}

@Injectable()
export class ApiUrl {
  url: String;

  setUrl(url) {
    this.url = url;
  }
}