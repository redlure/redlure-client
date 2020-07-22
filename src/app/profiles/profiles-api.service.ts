import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Profile } from './profile.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class ProfilesApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ProfilesApiService');
  }

  // GET list of all profiles from the server
  getProfiles(id: String): Observable<Profile[]> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/profiles`;
    return this.http.get<Profile[]>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('getProfiles', []))
      );
  }

  // POST a new profile to the server
  postProfile(workspaceId: String, name: String, fromAddress: String, smtpHost: String, smtpPort: Number, username: String,
    password: String, tls: boolean, ssl: boolean): Observable<Profile> {

    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/profiles`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    formData.append('From_Address', String(fromAddress))
    formData.append('SMTP_Host', String(smtpHost))
    formData.append('SMTP_Port', String(smtpPort))
    formData.append('Username', String(username))
    formData.append('Password', String(password))
    formData.append('TLS', String(tls))
    formData.append('SSL', String(ssl))

    return this.http.post<any>(url, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('postProfile', name))
      );
  }

  // DELETE a profile from the server
  deleteProfile(workspaceId: String, profileId: String): Observable<Profile> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/profiles/${profileId}`;
    return this.http.delete<any>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('deleteProfile'))
      );
  }

  // PUT: edit a profile on the server
  putProfile(workspaceId: String, profileId: String, name: String, fromAddress: String, smtpHost: String, smtpPort: number, username: String,
    password: String, tls: boolean, ssl: boolean): Observable<Profile> {

    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/profiles/${profileId}`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    formData.append('From_Address', String(fromAddress))
    formData.append('SMTP_Host', String(smtpHost))
    formData.append('SMTP_Port', String(smtpPort))
    formData.append('Username', String(username))
    formData.append('Password', String(password))
    formData.append('TLS', String(tls))
    formData.append('SSL', String(ssl))

    return this.http.put<any>(url, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('putProfile', name))
      );
  }

  // POST an email address to the server to have a test email sent to
  testProfile(workspaceId: String, id: String, email: String): Observable<Profile> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/profiles/${id}`;

    let formData: FormData = new FormData()
    formData.append('Address', String(email))

    return this.http.post<any>(url, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('testProfile'))
      );
  }

}
