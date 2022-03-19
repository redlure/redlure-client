import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../empty-object/message.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-evasion',
  templateUrl: './evasion.component.html',
  providers: [ MessageService ]
})
export class EvasionComponent implements OnInit {
  blockList: Object[];
  blockListHeaders = ["#", "IP CIDR", "Notes", "Actions"];
  blockListLoading = false;

  data = [
    {'cidr': '192.168.187.100/32', 'note': 'blah'},
    {'cidr': '192.168.0.0/16', 'note': 'hah'},
    {'cidr': '192.168.187.10/25', 'note': 'fake'},
    {'cidr': '192.168.187.101/32', 'note': 'data!'},
  ]

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger: Subject<any>[] = [];
  dtOptions: DataTables.Settings[] = [];

  constructor() { }

  addBlockEntry() {

  }

  deleteBlockEntry(blockEntry) {

  }

  editBlockEntry(blockEntry) {

  }

  ngOnInit(): void {
    this.dtTrigger["blockListTable"] = new Subject<any>();
    this.blockListLoading = true;
    // insert GET req logic
    this.dtTrigger['blockListTable'].next();
    this.blockListLoading = false;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger["blockListTable"].unsubscribe();
  }

}
