import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Domain } from './domain.model'
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class DomainsApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('DomainsApiService');
  }

  // GET list of all domains from the server
  getDomains(): Observable<Domain[]> {
    const url = `${this.apiService.getUrl()}/domains`;
    return this.http.get<Domain[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getDomains', []))
      );  
  }

  // POST a new domain to the server
  postDomain(domain: String, certPath: String, keyPath: String): Observable<Domain> {
    const url = `${this.apiService.getUrl()}/domains`;
    let formData: FormData = new FormData()
    formData.append('Domain', String(domain))
    formData.append('Cert_Path', String(certPath))
    formData.append('Key_Path', String(keyPath))

    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postDomain'))
      );  
  }

  // DELETE a domain from the server
  deleteDomain(id: Number): Observable<Domain> {
    const url = `${this.apiService.getUrl()}/domains/${id}`;
    return this.http.delete<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('deleteDomain'))
      );  
  }


}