import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnInit {
  @Input() result:any = {};
  timestamps = [];
  table = false;
  headers = ["#", "Action", "IP Address", "User-Agent", "Timestamp"]
  currentStyle = {
    'display': 'none'
  }

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public lineChartType= 'line';

  actions = [
    "Sent",
    "Opened",
    "Clicked",
    "Downloaded",
    "Submitted",
  ]

  public lineChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time', 
        ticks: { 
          //min: 0, max: 30,
          callback: value => this.timestamps[value]
        } 
      }],
      yAxes: [{
        ticks: {
          min: 0, max: 5,
          callback: value => this.actions[value]
        }
      }]
    }
  };

  public lineChartData = [
    {
      data: [],
      label: '',
    },
  ];

  public lineChartLegend = true;

  public lineChartColors = [
    {
      borderColor: 'rgb(40, 167, 69)',
      backgroundColor: 'rgba(40, 167, 69, 0.3)',
    },
  ];

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.lineChartData[0].label = this.result.person.email
    this.timestamps = this.result.events.map(event => new Date(event.time.replace(/-/g,'/')));
    
    // convert data to chat format
    this.result.events.forEach(event => {
      var y = 0
      if (event.action == 'Opened') { y = 1 }
      if (event.action == 'Clicked') { y = 2 }
      if (event.action == 'Downloaded') { y = 3 }
      if (event.action == 'Submitted') { y = 4 }
      this.lineChartData[0].data.push({ x: new Date(event.time.replace(/-/g,'/')), y: y, r:6 })
    });

    // set color
    if (this.result.status == 'Opened') { 
      this.lineChartColors[0].borderColor = 'rgb(108, 117, 125)'
      this.lineChartColors[0].backgroundColor = 'rgba(108, 117, 125, 0.3)'
    }
    if (this.result.status == 'Clicked') { 
      this.lineChartColors[0].borderColor = 'rgb(255, 193, 7)'
      this.lineChartColors[0].backgroundColor = 'rgba(255, 193, 7, 0.3)'
    }
    if (this.result.status == 'Downloaded') { 
      this.lineChartColors[0].borderColor = 'rgb(111, 66, 193)'
      this.lineChartColors[0].backgroundColor = 'rgba(111, 66, 193, 0.3)'
    }
    if (this.result.status == 'Submitted') { 
      this.lineChartColors[0].borderColor = 'rgb(220, 53, 69)'
      this.lineChartColors[0].backgroundColor = 'rgba(220, 53, 69, 0.3)'
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  toggleTable(bool) {
    this.table = bool;
    if (bool) {
      this.currentStyle = {
        'display': 'block'
      }
    } else {
      this.currentStyle = {
        'display': 'none'
      }
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

}
