import { Component, OnInit, HostListener,  ViewChildren, OnDestroy, QueryList } from '@angular/core';
import { ResultsApiService } from './results-api.service';
import { AlertService } from '../alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Result } from './result.model';
import { Target } from '../lists/targets/target.model';
import { FormComponent } from './form/form.component';
import { Observable } from 'rxjs';
import { TableComponent } from './table/table.component';
import { GraphsComponent } from './graphs/graphs.component';
import { DataService } from './data.service';
import { MessageService } from '../empty-object/message.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  providers: [ MessageService ]
})
export class ResultsComponent implements OnInit, OnDestroy {
  allResults: any[]; //all results returned by server
  results: any[] = []; //holds current filtered results
  forms: any[] = []; //holds submitted form data
  filtered = false;
  selectAll = true;
  selectedForm;

  loading = false;
  scheduled: number = 0;
  sent: number = 0;
  unopened: number = 0;
  opened: number = 0;
  clicked: number = 0;
  downloaded: number = 0;
  submitted: number = 0;
  
  intervalVar: any;
  
  workspaceId: String;
  campaigns: any[];
  campaignHeaders = ["ID", "Name", "Status", "Server", "Domain", "Start Date"];
  credHeaders = ["Email", "Campaign ID"]

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger: Subject<any>[] = [];
  dtOptions: DataTables.Settings = {}


  constructor(
    private resultsApiService: ResultsApiService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private dataService: DataService,
    private messageService: MessageService,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId']);
   }


  ngOnInit() {
    this.dtTrigger["formTable"] = new Subject<any>();
    this.dtTrigger["campaignTable"] = new Subject<any>();

    // info and length components were not rendering as left-justified on the table
    // hard coded to render there
    this.dtOptions = {
      dom: "<'row'<'col-sm-6 text-left'l><'col-sm-6'f>>" +
           "<'row'<'col-sm-12't>>" +
           "<'row'<'col-sm-6 text-left'i><'col-sm-6'p>>"
    }
    this.getResults(false);
    /*
    this.intervalVar = setInterval(() => {
      this.getResults();
    }, 10000);
    */
  }

  ngOnDestroy() {
    //clearInterval(this.intervalVar) // cancel the interval task
    //this.intervalVar = 0 // ensure the interval handle is cleared
    this.dtTrigger['campaignTable'].unsubscribe();
    this.dtTrigger['formTable'].unsubscribe();
  }

  rerender(table): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      let tableId = dtElement['el'].nativeElement.id
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          if (tableId == table) {
            dtInstance.destroy();
          } 
        });
      });
    this.dtTrigger[table].next(); 
  }
  

  onResultSelect(form){
    this.selectedForm = form;
  }

  getResults(rerender: Boolean) {
    this.loading = true;
    this.resultsApiService.getResults(this.workspaceId).subscribe(data => {
      this.allResults = data[1];
      this.campaigns = data[0];
      console.log(this.allResults)
      this.results = this.allResults;
      this.forms = this.getForms();
      this.calcStats();
      this.loading = false;
      this.setState();
      if(rerender) {
        this.rerender('campaignTable');
        this.rerender('formTable');
      } else {
        this.dtTrigger['campaignTable'].next();
        this.dtTrigger['formTable'].next();
      }
    });
  }

  calcStats() {
    this.scheduled = this.results.reduce((acc, cur) => cur.status === 'Scheduled' ? ++acc : acc, 0);
    this.sent = this.results.length - this.scheduled;
    this.opened = this.results.reduce((acc, cur) => cur.status === 'Opened' ? ++acc : acc, 0);
    this.clicked = this.results.reduce((acc, cur) => cur.status === 'Clicked' ? ++acc : acc, 0);
    this.downloaded = this.results.reduce((acc, cur) => cur.status === 'Downloaded' ? ++acc : acc, 0);
    this.submitted = this.results.reduce((acc, cur) => cur.status === 'Submitted' ? ++acc : acc, 0);
    this.unopened = this.results.length - this.opened - this.clicked - this.downloaded - this.submitted - this.scheduled;
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
    this.calcStats();
    this.rerender('formTable')
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
    this.calcStats();
    this.rerender('formTable')
  }

  // if campaign state is undefined set to true, so that checkbox starts as checked
  setState() {
    this.campaigns.forEach(campaign => {
      if (typeof(campaign.state) == 'undefined') {
        campaign.state = true;
      }
    });
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

  // open the FormComponent to show submitted FormData
  openFormModal(form) {
    this.onResultSelect(form);
    const modalRef = this.modalService.open(FormComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.selectedForm = this.selectedForm;
  }

  // open the GraphComponent for visuals of results
  openVisuals() {
    // sent current results to the data service
    this.dataService.updateData([this.unopened, this.opened, this.clicked, this.downloaded, this.submitted])
    //open modal
    const modalRef = this.modalService.open(GraphsComponent, { size: 'lg', backdrop: 'static' });
  }

  // open the TableComponent showing a table of results and their property values
  openTable(status) {
    // filter the result set based on the clicked status
    var filteredResults: any[] = [];
    // if status is 'Sent' we really want all results
    if (status == 'Sent') {
      filteredResults = this.results.filter(function(result) {
        return result.status != 'Scheduled';
      });
    } else {
      // if status is 'Unopened' we really want results whose status is still 'Sent'
      if (status == 'Unopened') {
        status = 'Sent'
      }
      // filter the array of results
      filteredResults = this.results.filter(function(result) {
        return result.status == status;
      });
    }

    // open the modal and pass the filtered result set
    const modalRef = this.modalService.open(TableComponent, { windowClass: 'hugeModal' });
    modalRef.componentInstance.results = filteredResults;
  }

}
