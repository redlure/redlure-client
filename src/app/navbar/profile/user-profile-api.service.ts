import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../../login/api.service'
import { HttpErrorHandler, HandleError } from '../../http-error-handler.service';


@Injectable()
export class UserProfileApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('UserProfileApiService');
  }

  // GET listhe logged in user
  getCurrentUser(): Observable<Object> {
    const url = `${this.apiService.getUrl()}/users/current`;
    return this.http.get<Object>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getCurrentUser', []))
      );  
  }
}