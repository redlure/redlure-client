import {Injectable} from '@angular/core';

@Injectable()
export class MessageService {

message: String = '';

  constructor(){

  }
  
  setMessage(message) {
      this.message = message;
  }

}

