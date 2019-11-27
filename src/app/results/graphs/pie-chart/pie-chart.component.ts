import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnInit {
  subscription: Subscription;
  
  public chartLegend:boolean = true;
  public chartType:string = 'doughnut';

  public chartData = {
    labels: ["Unopened", "Opened", "Clicked", "Submitted"],
    datasets: [{
        label: '# of Users',
        data: [],
        backgroundColor: [
            '#28a745',
            '#6c757d',
            '#ffc107',
            '#dc3545',
        ],
        borderColor: [
          '#28a745',
          '#6c757d',
          '#ffc107',
          '#dc3545'
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          '#28a745',
          '#6c757d',
          '#ffc107',
          '#dc3545',
      ]
    }],
    options: {}
};

  barOptions = {
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
    }
  }
  
  constructor(private dataService: DataService) {
    this.subscription = this.dataService.getType().subscribe(type => {
      this.chartType = type;
      if (type == 'bar'){
        this.chartData.options = this.barOptions;
      } else {
        this.chartData.options = {};
      }
    });
  }

  ngOnInit() {
    this.chartData.datasets[0].data = this.dataService.currentData;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
