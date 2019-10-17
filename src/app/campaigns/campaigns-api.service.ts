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


  // POST a new campaign to the server
  postCampaign(id: String, name: String, email: String, profile: String, list: String, batchNumber: Number,
    batchInterval: Number, startTime: Date, domain: String, server: String, port: Number, ssl: Boolean,
    pages: String[], redirectUrl: String, payloadUrl: String) {

    const url = `${this.apiService.getUrl()}/workspaces/${id}/campaigns`;
    let formData: FormData = new FormData();
    formData.append('Name', String(name));
    formData.append('Email_Name', String(email));
    formData.append('Profile_Name', String(profile));
    formData.append('List_Name', String(list));
    formData.append('Domain_Name', String(domain));
    formData.append('Server_Alias', String(server));
    formData.append('Port', String(port));
    formData.append('SSL', String(ssl));
    formData.append('Redirect_URL', String(redirectUrl));
    formData.append('Start_Time', String(startTime));
    formData.append('Interval', String(batchInterval));
    formData.append('Batch_Size', String(batchNumber));
    formData.append('Payload_URL', String(payloadUrl));


    pages.forEach(page => {
      formData.append('Page_Names[]', String(page));
    });

    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('postCampaign'))
      );  
  }


  // GET list of page names, email names etc from the server available to create campaigns with
  getAllModules(id: String): Observable<any> {
    const url = `${this.apiService.getUrl()}/workspaces/${id}/campaigns/modules`;
    return this.http.get<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getAllModules', []))
      );  
  }

  // DELETE a campaign from the server
  deleteCampaign(workspaceId: String, campaignId: String): Observable<Campaign> {
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/campaigns/${campaignId}`;
    return this.http.delete<any>(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('deleteCampaign'))
      );  
  }

  // start a campaign
  launchCampaign(workspaceId: String, campaignId: String){
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/campaigns/${campaignId}/cast`;
    return this.http.get(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('launchCampaign', []))
      );  
  }

  // kill a campaign
  killCampaign(workspaceId: String, campaignId: String){
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/campaigns/${campaignId}/kill`;
    return this.http.get(url, {withCredentials: true})
      .pipe(
        catchError(this.handleError('killCampaign', []))
      );
  }

  // Valiate that domain resolves to IP of server
  validateIps(workspaceId: String, domain: String, server: String){
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/campaigns/validateips`;
    let formData: FormData = new FormData();
    formData.append('Domain', String(domain));
    formData.append('Server', String(server));
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('validateIps'))
      );  
  }

  // Valiate that certificates for the domain exist on a server
  validateCerts(workspaceId: String, domain: String, server: String){
    const url = `${this.apiService.getUrl()}/workspaces/${workspaceId}/campaigns/validatecerts`;
    let formData: FormData = new FormData();
    formData.append('Domain', String(domain));
    formData.append('Server', String(server));
    return this.http.post<any>(url, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError('validateIps'))
      );  
  }
}
