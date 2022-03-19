import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../empty-object/message.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BlocklistEntry } from './blocklist.model';
import { EvasionApiService } from './evasion-api.service';
import { Console } from 'console';


@Component({
  selector: 'app-evasion',
  templateUrl: './evasion.component.html',
  providers: [ MessageService ]
})
export class EvasionComponent implements OnInit {
  blocklist: BlocklistEntry[];
  blocklistHeaders = ["#", "IP CIDR", "Notes", "Actions"];
  loading = false;

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger: Subject<any>[] = [];
  dtOptions: DataTables.Settings[] = [];

  constructor(
    private evasionApiService: EvasionApiService,
    private modalService: NgbModal
  ) { }

  addBlockEntry() {

  }

  deleteBlockEntry(blockEntry) {

  }

  editBlockEntry(blockEntry) {

  }

  getBlocklist(): void {
    this.loading = true;
    this.evasionApiService.getBlocklist()
      .subscribe(
        blocklist => {
          console.log(blocklist)
          this.blocklist = blocklist;
          this.loading = false;
        });
  }

  ngOnInit(): void {
    this.dtTrigger["blocklistTable"] = new Subject<any>();
    this.getBlocklist();
    this.dtTrigger['blocklistTable'].next();
    this.loading = false;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger["blocklistTable"].unsubscribe();
  }

}
