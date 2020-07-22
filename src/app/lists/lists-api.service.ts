import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { List } from './list.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { Target } from './targets/target.model'


@Injectable()
export class ListsApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ListsApiService');
  }

  // GET list of all lists from the server
  getLists(id: String): Observable<List[]> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/lists`;
    return this.http.get<List[]>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('getLists', []))
      );
  }

  // POST a new list to the server
  postList(workspaceId: String, name: String, targets: Target[]): Observable<List> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/lists`;

    let body = {
      name: name,
      targets: targets
    }

    return this.http.post<any>(url, body, { withCredentials: true })
      .pipe(
        catchError(this.handleError('postList', name))
      );
  }

  // DELETE a list from the server
  deleteList(workspaceId: String, listId: String): Observable<List> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/lists/${listId}`;
    return this.http.delete<any>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('deleteList'))
      );
  }

  // PUT: edit a list on the server
  putList(workspaceId: String, listId: String, name: String, targets: Target[]): Observable<List> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/lists/${listId}`;

    let body = {
      name: name,
      targets: targets
    }

    return this.http.put<any>(url, body, { withCredentials: true })
      .pipe(
        catchError(this.handleError('postList', name))
      );
  }

}
