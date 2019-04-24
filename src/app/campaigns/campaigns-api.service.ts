import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'
import { ApiService } from '../login/api.service'
import { Campaign } from './campaign.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignsApiService {
  private handleError: HandleError;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
      this.handleError = httpErrorHandler.createHandleError('CampaignsApiService');
  }

  // GET list of all lists from the server
  getCampaigns(id: String): Observable<Campaign[]> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/campaigns`;
    return this.http.get<Campaign[]>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getCampaigns', []))
      );  
  }
}
