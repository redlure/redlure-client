import { Component, OnInit } from '@angular/core';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit {

  alerts: Alert[] = [];

  constructor() { }

  ngOnInit() {
  }

  newAlert(type: string, message: string) {
    this.alerts.unshift({type: type, message: message})
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }


}
