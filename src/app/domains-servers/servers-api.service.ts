import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import {API_URL} from '../env';
import { Server } from './server.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';


@Injectable()
export class ServersApiService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('WorkspacesApiService');
  }

  // GET list of all servers from the server
  getServers(): Observable<Server[]> {
    const url = `${API_URL}/servers`;
    return this.http.get<Server[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getServers', []))
      );  
  }

  // POST a new server (worker) to the server
  postServer(ip: String, alias: String, port: Number): Observable<Server> {
    const url = `${API_URL}/servers`;
    let formData: FormData = new FormData()
    formData.append('Alias', String(alias))
    formData.append('IP', String(ip))
    formData.append('Port', String(port))
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postServer'))
      );  
  }

    // DELETE a server (worker) from the server
    deleteServer(id: Number): Observable<Server> {
      const url = `${API_URL}/servers/${id}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteServer'))
        );  
    }

    // GET the status of a server (worker)
    refreshServerStatus(id: Number): Observable<Server> {
      const url = `${API_URL}/servers/${id}/status`;
      return this.http.get<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('refreshServer'))
        );  
    }


}