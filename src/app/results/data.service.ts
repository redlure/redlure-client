import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DataService {

  currentData = []
  private chartType = new Subject<string>();

  constructor() { }

  updateData(numbers) {
    this.currentData = numbers;
  }

  updateType(type: string) {
      this.chartType.next(type);
  }

  getType(): Observable<any> {
      return this.chartType.asObservable();
  }

}