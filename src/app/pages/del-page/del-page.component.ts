import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PagesApiService } from '../pages-api.service'
import { first } from 'rxjs/operators'
import { Page } from '../page.model'

@Component({
  selector: 'app-del-page',
  templateUrl: './del-page.component.html'
})

export class DelPageComponent implements OnInit {
  loading = false;
  workspaceId: String;
  @Input() editPage: Page;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private pagesApiService: PagesApiService,
  ) { }

  ngOnInit() {
    this.workspaceId = this.router.url.split('/')[2];
  }

  closeModal() {
    this.activeModal.close();
  }

  deletePage() {
    this.loading = true;
    this.pagesApiService.deletePage(this.workspaceId, String(this.editPage.id))
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.emitter.emit(this.editPage)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}