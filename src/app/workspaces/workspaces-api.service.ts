import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import {Workspace} from './workspace.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class WorkspacesApiService {
  workspacesUrl = `${API_URL}/workspaces`;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('WorkspacesApiService');
  }

  // GET list of all workspaces from the server
  getWorkspaces(): Observable<Workspace[]> {
    console.log('trying to get');
    return this.http.get<Workspace[]>(this.workspacesUrl)
      .pipe(
        catchError(this.handleError('getWorkspaces', []))
      );
        
        
      
  }
}