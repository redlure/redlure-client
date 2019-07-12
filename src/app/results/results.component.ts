import { Component, OnInit } from '@angular/core';
import { ResultsApiService } from './results-api.service'
import { AlertService } from '../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'
import { Result } from './result.model'
import { Target } from '../lists/targets/target.model';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit {
  allResults: any[]; //all results returned by server
  results: any[] = []; //holds current filtered results
  forms: any[] = []; //holds submitted form data
  filtered = false;
  selectAll = true;
  
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
  }

  getResults() {
    this.resultsApiService.getResults(this.workspaceId).subscribe(data => {
      this.allResults = data[1];
      this.campaigns = data[0];
      this.results = this.allResults;
      this.forms = this.results.map(result => result.forms).filter(result => typeof(result.forms.length) !== 'undefined');
      console.log(this.forms)
    });
  }

  calcProgress(status) {
    return this.results.reduce((acc, cur) => cur.status === status ? ++acc : acc, 0);
  }

  calcUnopen() {
    return (this.results.length - this.calcProgress("Opened") - this.calcProgress("Clicked") - this.calcProgress("Submitted"))
  }

  toggleSelectAll(event) {
    this.campaigns.forEach(campaign => campaign.state = event.target.checked);
    if (event.target.checked) {
      this.results = this.allResults;
      this.forms = this.results.map(result => result.forms).filter(result => result.forms.length > 0);
    } else {
      this.results = [];
      this.forms = [];
    }
  }

  toggleSelect(event, campaignId) {
    let results = this.allResults.filter(result => result.campaign_id === campaignId);
    if (event.target.checked) {
      this.results = this.results.concat(results);
      this.forms = this.results.map(result => result.forms).filter(result => result.forms.length > 0);
    } else {
      this.results = this.results.filter(result => results.indexOf(result) < 0);
      this.forms = this.results.map(result => result.forms).filter(result => result.forms.length > 0);
    }
  }

  setState(campaign) {
    if (typeof(campaign.state) == 'undefined') {
      campaign.state = true;
    }
  }

  getEmail(id){
    return this.results.filter(result => result.id === id)[0].person.email;
  }

  getCId(id){
    return this.results.filter(result => result.id === id)[0].campaign_id;
  }

}
