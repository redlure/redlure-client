import { Component, OnInit } from '@angular/core';
import { ResultsApiService } from './results-api.service'
import { AlertService } from '../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit {
  results: Object[];
  workspaceId: String;


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
    this.resultsApiService.getResults(this.workspaceId).subscribe(data => this.results = data[0]);
  }

}
