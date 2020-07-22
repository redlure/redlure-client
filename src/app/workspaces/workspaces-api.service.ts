import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Workspace } from './workspace.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class WorkspacesApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('WorkspacesApiService');
  }

  // GET list of all workspaces from the server
  getWorkspaces(): Observable<Workspace[]> {
    const url = `${this.apiService.getUrl()}/workspaces`;
    return this.http.get<Workspace[]>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('getWorkspaces', []))
      );
  }

  // POST a new workspace to the server
  postWorkspace(name: String): Observable<Workspace> {
    const url = `${this.apiService.getUrl()}/workspaces`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    return this.http.post<any>(url, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('postWorkspace', name))
      );
  }

  // DELETE a workspace from the server
  deleteWorkspace(id: Number): Observable<Workspace> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}`;
    return this.http.delete<any>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('deleteWorkspace'))
      );
  }

  //GET a specific workspace from the server
  getWorkspace(id: String): Observable<Workspace> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}`;
    return this.http.get<Workspace>(url, { withCredentials: true });
  }

}
