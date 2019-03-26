import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import { Profile } from './profile.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class ProfilesApiService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('ProfilesApiService');
  }

  // GET list of all workspaces from the server
  getProfiles(id: String): Observable<Profile[]> {
    const url = `${API_URL}/workspaces/${id}/profiles`;
    return this.http.get<Profile[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getProfiles', []))
      );  
  }

  // POST a new profile to the server
  postProfile(workspaceId: String, name: String, fromAddress: String, smtpHost: String, smtpPort: number, username: String,
    password: String, tls: boolean, ssl: boolean): Observable<Profile> {

      const url = `${API_URL}/workspaces/${workspaceId}/profiles`;
      let formData: FormData = new FormData()
      formData.append('Name', String(name))
      formData.append('From_Address', String(fromAddress))
      formData.append('SMTP_Host', String(smtpHost))
      formData.append('SMTP_Port', String(smtpPort))
      formData.append('Username', String(username))
      formData.append('Password', String(password))
      formData.append('TLS', String(tls))
      formData.append('SSL', String(ssl))

      return this.http.post<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('postProfiles', name))
        );  
  }

    // DELETE a profile from the server
    deleteProfile(workspaceId: String, id: String): Observable<Profile> {
      const url = `${API_URL}/workspaces/${workspaceId}/profiles/${id}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteProfile'))
        );  
    }

}