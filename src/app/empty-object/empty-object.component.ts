import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service'

@Component({
  selector: 'app-empty-object',
  templateUrl: './empty-object.component.html'
})
export class EmptyObjectComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
