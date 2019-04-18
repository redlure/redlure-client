import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import { Role } from './role.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class RolesApiService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('RolesApiService');
  }

  // GET list of all roles from the role
  getRoles(): Observable<Object[]> {
    const url = `${API_URL}/roles`;
    return this.http.get<Object[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getRoles', []))
      );  
  }

  // POST a new role (worker) to the role
  postRole(name: String, type: String): Observable<Object> {
    const url = `${API_URL}/roles`;
    let formData: FormData = new FormData()
    formData.append('Name', String(name))
    formData.append('Role_Type', String(type))
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postRole'))
      );  
  }

    // DELETE a role (worker) from the role
    deleteRole(id: String): Observable<Object> {
      const url = `${API_URL}/roles/${id}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteRole'))
        );  
    }

    // PUT: add/remove workspace access from a role
    putRole(id: String, workspaceIds: Number[]): Observable<Role> {
      const url = `${API_URL}/roles/${id}`;
      let formData: FormData = new FormData()
      workspaceIds.forEach(id => {
        formData.append('Workspace_ID[]', String(id))
      });
      return this.http.put<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('putRole'))
        );  
    }


}