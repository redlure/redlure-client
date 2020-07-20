import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Server } from './server.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable()
export class ServersApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('ServersApiService');
  }

  // GET list of all servers from the server
  getServers(): Observable<Server[]> {
    const url = `${this.apiService.getUrl()}/servers`;
    return this.http.get<Server[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getServers', []))
      );  
  }

  // POST a new server (worker) to the server
  postServer(ip: String, alias: String, port: Number): Observable<Server> {
    const url = `${this.apiService.getUrl()}/servers`;
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
      const url = `${this.apiService.getUrl()}/servers/${id}`;
      return this.http.delete<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteServer'))
        );  
    }

    // GET the status of a server (worker)
    refreshServerStatus(id: Number): Observable<Server> {
      const url = `${this.apiService.getUrl()}/servers/${id}/status`;
      return this.http.get<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('refreshServer'))
        );  
    }


    // GET the processes listening on a server (worker)
    checkServerProcesses(id: Number): Observable<Server> {
      const url = `${this.apiService.getUrl()}/servers/${id}/processes`;
      return this.http.get<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('refreshServer'))
        );  
    }

    // GET the current worker API key
    getApiKey(): Observable<String> {
      const url = `${this.apiService.getUrl()}/api`;
      return this.http.get<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getApiKey'))
      );  
    }

    // GET: generate a new worker API key
    refreshApiKey(): Observable<String> {
      const url = `${this.apiService.getUrl()}/api/generate`;
      return this.http.get<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getApiKey'))
      );  
    }


    //POST file to a server
    uploadFile(id: Number, file: File): Observable<String> {
      const url = `${this.apiService.getUrl()}/servers/${id}/files`;
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http.post<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('uploadFile'))
        )
    }

    // GET files on the server
    getFiles(id: Number): Observable<any[]> {
      const url = `${this.apiService.getUrl()}/servers/${id}/files`;
      return this.http.get<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('getFiles'))
        )
    }

    // POST request to the server to delete a specified file
    deleteFile(id: Number, fileName: String): Observable<String> {
      console.log(fileName)
      const url = `${this.apiService.getUrl()}/servers/${id}/files/delete`;
      let formData: FormData = new FormData();
      formData.append('Filename', String(fileName));
      return this.http.post<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteFile'))
        )
    }

    // GET request to the server to delete all files in the upload folder
    deleteFiles(id: Number): Observable<String> {
      const url = `${this.apiService.getUrl()}/servers/${id}/files/delete`;
      return this.http.get<any>(url, {withCredentials: true})
        .pipe(
          catchError(this.handleError('deleteFiles'))
        )
    }

    // POST a new server (worker) to the server
    putServer(id: Number, ip: String, alias: String, port: Number): Observable<Server> {
      const url = `${this.apiService.getUrl()}/servers/${id}`;
      let formData: FormData = new FormData()
      formData.append('Alias', String(alias))
      formData.append('IP', String(ip))
      formData.append('Port', String(port))
      return this.http.put<any>(url, formData, {withCredentials: true})
        .pipe(
          catchError(this.handleError('postServer'))
        );  
    }


}
