import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ResultsApiService } from './results-api.service'
import { AlertService } from '../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'
import { Result } from './result.model'
import { Target } from '../lists/targets/target.model';
import { FormComponent } from './form/form.component'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {
  allResults: any[]; //all results returned by server
  results: any[] = []; //holds current filtered results
  forms: any[] = []; //holds submitted form data
  filtered = false;
  selectAll = true;
  selectedForm;
  
  intervalVar: any;
  
  workspaceId: String;
  campaigns: any[];
  headers = ["#", "Status", "Email", "First Name", "Last Name", "Tracker", "Campaign ID"];
  campaignHeaders = ["ID", "Name", "Status", "Server", "Start Date"];
  credHeaders = ["Email", "Campaign ID"]


  constructor(
    private resultsApiService: ResultsApiService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId']);
   }


  ngOnInit() {
    this.getResults();
    /*
    this.intervalVar = setInterval(() => {
      this.getResults();
    }, 10000);
    */
  }

  ngOnDestroy() {
    clearInterval(this.intervalVar) // cancel the interval task
    this.intervalVar = 0 // ensure the interval handle is cleared
  }

  onResultSelect(form){
    this.selectedForm = form;
  }

  getResults() {
    this.resultsApiService.getResults(this.workspaceId).subscribe(data => {
      this.allResults = data[1];
      this.campaigns = data[0];
      this.results = this.allResults;
      this.forms = this.getForms();
    });
  }

  calcProgress(status) {
    return this.results.reduce((acc, cur) => cur.status === status ? ++acc : acc, 0);
  }

  calcUnopen() {
    return (this.results.length - this.calcProgress("Opened") - this.calcProgress("Clicked") - this.calcProgress("Submitted") - this.calcProgress("Scheduled"))
  }

  calcSent() {
    return (this.results.length - this.calcProgress("Scheduled"))
  }

  toggleSelectAll(event) {
    this.campaigns.forEach(campaign => campaign.state = event.target.checked);
    if (event.target.checked) {
      this.results = this.allResults;
      this.forms = this.getForms();
    } else {
      this.results = [];
      this.forms = [];
    }
  }

  toggleSelect(event, campaignId) {
    let results = this.allResults.filter(result => result.campaign_id === campaignId);
    if (event.target.checked) {
      this.results = this.results.concat(results);
      this.forms = this.getForms();
    } else {
      this.results = this.results.filter(result => results.indexOf(result) < 0);
      this.forms = this.getForms();
    }
  }

  // if campaign state is undefined set to true, so that checkbox starts as checked
  setState(campaign) {
    if (typeof(campaign.state) == 'undefined') {
      campaign.state = true;
    }
  }


  // return an email address given a result ID
  getEmail(id){
    return this.results.filter(result => result.id === id)[0].person.email;
  }

  
  // return the campaign ID given a result ID
  getCId(id){
    return this.results.filter(result => result.id === id)[0].campaign_id;
  }


  // get all form data arrays that are no empty and flatten all results into 1 array (vs array of arrays)
  getForms(){
    return [].concat.apply([], this.results.map(result => result.forms).filter(result => result.length > 0));
  }

  openFormModal(form) {
    this.onResultSelect(form);
    const modalRef = this.modalService.open(FormComponent, { size: 'lg' });
    modalRef.componentInstance.selectedForm = this.selectedForm;
  }

  sortResults(col) {
    console.log(col)
  }

}
