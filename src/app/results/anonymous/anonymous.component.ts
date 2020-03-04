import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultsApiService } from '../results-api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { get } from 'https';
import { FormComponent } from '../form/form.component';



@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html'
})
export class AnonymousComponent implements OnInit {

  loading = false;
  events: any[] = [];
  headers = ["#", "IP Address", "Timestamp", "Action"]
  selectedForm = {};

  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    private resultsApiService: ResultsApiService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getGenericSubs()
  }

  closeModal(){
    this.activeModal.close();
  }

  onResultSelect(event){
    this.selectedForm = event;
  }

  getGenericSubs(){
    this.loading = true;
    this.resultsApiService.getGenericResults()
      .subscribe(data => {
        this.loading = false;
        this.events = data;
        this.dtTrigger.next();
      });
  }

  deleteEvent(event) {
    this.loading = true
    this.resultsApiService.deleteGenericResult(event.id)
      .subscribe(data => {
        this.loading = false;
        const index: number = this.events.indexOf(event);
        if (index !== -1) {
          this.events.splice(index, 1);
          this.rerender();
        }
    });
  }

  deleteAll() {
    this.loading = true;
    this.resultsApiService.deleteGenericResults()
      .subscribe(data => {
        this.loading = false;
        this.events = [];
        this.rerender();
    });
  }

  // open the FormComponent to show submitted FormData
  openFormModal(event) {
    this.onResultSelect(event)
    const modalRef = this.modalService.open(FormComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submitEvent = this.selectedForm;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
