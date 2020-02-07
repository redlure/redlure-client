import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EmailsApiService } from '../emails-api.service'
import { first } from 'rxjs/operators'
import { Email } from '../email.model'

@Component({
  selector: 'app-del-email',
  templateUrl: './del-email.component.html'
})

export class DelEmailComponent implements OnInit {
  loading = false;
  workspaceId: String;
  @Input() editEmail: Email;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private emailsApiService: EmailsApiService,
  ) { }

  ngOnInit() {
    this.workspaceId = this.router.url.split('/')[2];
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteEmail() {
    this.loading = true;
    this.emailsApiService.deleteEmail(this.workspaceId, String(this.editEmail.id))
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.emitter.emit(this.editEmail)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}