import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { BlocklistEntry } from './blocklist.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

@Injectable()
export class EvasionApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('EvasionApiService');
  }

  // GET list of all workspaces from the server
  getBlocklist(): Observable<BlocklistEntry[]> {
    const url = `${this.apiService.getUrl()}/evasion/blocklist`;
    return this.http.get<BlocklistEntry[]>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('getBlocklist', []))
      );
  }

  // POST a new workspace to the server
  postBlocklistEntry(blocklistEntry: BlocklistEntry): Observable<BlocklistEntry> {
    const url = `${this.apiService.getUrl()}/evasion/blocklist`;
    let formData: FormData = new FormData()
    formData.append('CIDR', String(blocklistEntry.cidr))
    formData.append('Note', String(blocklistEntry.note))
    return this.http.post<any>(url, formData, { withCredentials: true })
      .pipe(
        catchError(this.handleError('postBlocklistEntry', blocklistEntry.cidr))
      );
  }

  // DELETE a workspace from the server
  deleteBlocklistEntry(id: Number): Observable<BlocklistEntry> {
    const url = `${this.apiService.getUrl()}/evasion/blocklist/${id}`;
    return this.http.delete<any>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError('deleteBlocklistEntry'))
      );
  }

  //GET a specific workspace from the server
  getBlocklistEntry(id: String): Observable<BlocklistEntry> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}`;
    return this.http.get<BlocklistEntry>(url, { withCredentials: true });
  }

}
