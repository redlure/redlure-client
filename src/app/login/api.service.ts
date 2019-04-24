import {Injectable} from '@angular/core';

@Injectable()
export class ApiService {

  url: String;

  constructor(){

  }

  setUrl(url) {
    this.url = url;
    localStorage.setItem('apiUrl', url);
  }

  getUrl() {
      if (this.url) {
          return this.url;
      } else {
          return localStorage.getItem('apiUrl')
      }
  }

}

