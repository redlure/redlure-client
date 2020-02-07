import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ListsApiService } from '../lists-api.service'
import { first } from 'rxjs/operators'
import { List } from '../list.model'

@Component({
  selector: 'app-del-list',
  templateUrl: './del-list.component.html'
})
export class DelListComponent implements OnInit {
  loading = false;
  workspaceId: String;
  @Input() editList: List;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private listsApiService: ListsApiService,
  ) { }

  ngOnInit() {
    this.workspaceId = this.router.url.split('/')[2];
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteList() {
    this.loading = true;
    this.listsApiService.deleteList(this.workspaceId, String(this.editList.id))
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.emitter.emit(this.editList);
                this.closeModal();
            },
            error => {
                console.log(error)
            });
            
}

}