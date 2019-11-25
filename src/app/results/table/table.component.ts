import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  headers = ["#", "Status", "Email", "First Name", "Last Name", "Tracker", "Campaign ID"];
  @Input() results: any[] = [];
  copyOfResults: any[] = []

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit() {
    //this.copyOfResults = this.results.map(obj => ({...obj}));
    //console.log(this.copyOfResults)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
