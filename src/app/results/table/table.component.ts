import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { wsName } from '../../env';
import { LineChartComponent } from '../graphs/line-chart/line-chart.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  headers = ["#", "Status", "Email", "First Name", "Last Name", "Tracker", "Campaign", "Campaign ID"];
  @Input() results: any[] = [];
  @Input() campaigns: any[] = [];
  copyOfResults: any[] = []

  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit() {
    //this.copyOfResults = this.results.map(obj => ({...obj}));
    this.dtOptions = {
      dom: "<'row'<'col-sm-12' l>>" +
        "<'row'<'col-sm-6'B><'col-sm-6'f>>" +
        "<'row'<'col-sm-12't>>" +
        "<'row'<'col-sm-6'i><'col-sm-6'p>>",
      buttons: [
        {
          extend: "csv",
          text: "Export to CSV",
          title: `${wsName}-Results`
        }
      ]
    }
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

  getCampaignName(id) {
    return this.campaigns.find(campaign => campaign.id === id).name
  }

  openChart(result) {
    const modalRef = this.modalService.open(LineChartComponent, { windowClass: 'largerModal', backdrop: 'static' });
    modalRef.componentInstance.result = result;
  }
}
