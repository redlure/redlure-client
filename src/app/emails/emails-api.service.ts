import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Email } from './email.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class EmailsApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('EmailsApiService');
  }

  // GET list of all workspaces from the server
  getEmails(id: String): Observable<Email[]> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/emails`;
    return this.http.get<Email[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getEmails', []))
      );  
  }

  // POST a new email to the server
  postEmail(workspaceId: String, name: String, html: String, subject: String, track: Boolean): Observable<Email> {
      const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/emails`;
      let formData: FormData = new FormData()
      formData.append('Name', String(name))
      formData.append('HTML', String(html))
      formData.append('Subject', String(subject))
      formData.append('Track', String(track))

      return this.http.post<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('postEmail', name))
        );  
  }

    // DELETE a email from the server
    deleteEmail(workspaceId: String, emailId: String): Observable<Email> {
      const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/emails/${emailId}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteEmail'))
        );  
    }

    // PUT: edit a email on the server
    putEmail(workspaceId: String, emailId: String, name: String, html: String, subject: String, track: Boolean): Observable<Email> {
        const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/emails/${emailId}`;
        let formData: FormData = new FormData()
        formData.append('Name', String(name))
        formData.append('HTML', String(html))
        formData.append('Subject', String(subject))
        formData.append('Track', String(track))

        return this.http.put<any>(url, formData, {withCredentials: true})
          .pipe(
            catchError(this.handleError('putEmail', name))
          );  
    }

}