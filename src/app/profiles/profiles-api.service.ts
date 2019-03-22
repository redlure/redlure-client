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
    console.log('hitting')
    const url = `${API_URL}/workspaces/${id}/profiles`;
    return this.http.get<Profile[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getProfiles', []))
      );  
  }

  // POST a new workspace to the server
  postProfiles(id: String, name: String): Observable<Profile> {
    const url = `${API_URL}/workspaces/${id}/profiles`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postProfiles', name))
      );  
  }

  /*/ GET a specific workspace from the server
  getProfile(id: String): Observable<Profile> {
    const url = `${API_URL}/workspaces/${id}`;
    return this.http.get<Profile>(url + '/'  + id, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getProfile'))
      );  
  }*/

}