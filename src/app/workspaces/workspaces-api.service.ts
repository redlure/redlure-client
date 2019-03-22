import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import {Workspace} from './workspace.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class WorkspacesApiService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('WorkspacesApiService');
  }

  // GET list of all workspaces from the server
  getWorkspaces(): Observable<Workspace[]> {
    const url = `${API_URL}/workspaces`;
    return this.http.get<Workspace[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getWorkspaces', []))
      );  
  }

  // POST a new workspace to the server
  postWorkspace(name: String): Observable<Workspace> {
    const url = `${API_URL}/workspaces`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postWorkspace', name))
      );  
  }

  // DELETE a workspace from the server
  deleteWorkspace(id: Number): Observable<Workspace> {
    const url = `${API_URL}/workspaces/${id}`;
    return this.http.delete<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('deleteWorkspace'))
      );  
  }

  /*/ GET a specific workspace from the server
  getWorkspace(id: String): Observable<Workspace> {
    const url = `${API_URL}/workspaces/${id}`;
    return this.http.get<Workspace>(url + '/'  + id, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getWorkspace'))
      );  
  }*/

}