import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators'


interface Alert {
    type: string;
    message: string;
}

@Injectable()
export class AlertService {

alerts: Alert[] = [];

  constructor(){

  }
  

  newAlert(type: string, message: string) {
    if (this.alerts.length == 1) {
        this.alerts.pop()
    }
    this.alerts.unshift({type: type, message: message})
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}

