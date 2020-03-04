import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class ResultsApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('ResultsApiService');
  }

  // GET list of all results from the server
  getResults(id: String): Observable<any[]> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/results`;
    return this.http.get<any[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getResults', []))
      );  
  }

  // GET list of generic/anonymous results from the server
  getGenericResults(): Observable<any[]> {
    const url = `${this.apiService.getUrl()}/results/generic`;
    return this.http.get<any[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getGenericResults', []))
      );  
  }

  // DELETE a generic result
  deleteGenericResult(id: Number): Observable<any> {
    const url = `${this.apiService.getUrl()}/results/generic/${id}`;
    return this.http.delete<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('deleteGenericResult'))
      );  
  }

  // DELETE all generic results
  deleteGenericResults(): Observable<any> {
    const url = `${this.apiService.getUrl()}/results/generic`;
    return this.http.delete<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('deleteGenericResult'))
      );  
  }

}