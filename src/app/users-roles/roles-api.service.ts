import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
//import { Role } from './role.model';
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
  postRole(ip: String, alias: String, port: Number): Observable<Object> {
    const url = `${API_URL}/roles`;
    let formData: FormData = new FormData()
    formData.append('Alias', String(alias))
    formData.append('IP', String(ip))
    formData.append('Port', String(port))
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postRole'))
      );  
  }

    // DELETE a role (worker) from the role
    deleteRole(id: Number): Observable<Object> {
      const url = `${API_URL}/roles/${id}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteRole'))
        );  
    }


}