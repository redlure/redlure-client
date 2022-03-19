import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../empty-object/message.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-new-blocklist-entry',
  templateUrl: './new-blocklist-entry.component.html',
  providers: [ MessageService ]
})
export class NewBlocklistEntryComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  
  }


}
