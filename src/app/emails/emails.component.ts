import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsApiService } from './emails-api.service'
import { Email } from './email.model';
import { DelEmailComponent } from './del-email/del-email.component'
//import { EditEmailComponent } from './edit-email/edit-email.component'
//import { NewEmailComponent } from './new-email/new-email.component'
import { AlertService } from '../alert/alert.service'
import { first } from 'rxjs/operators'
import { MessageService } from '../empty-object/message.service';
import { ImportModuleComponent } from '../import-module/import-module.component';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  providers: [ EmailsApiService, MessageService ]
})
export class EmailsComponent implements OnInit {
  workspaceId: String;
  emails: Email[] = [];
  editEmail: Email; // the Workspace currently being edited
  loading = false;

  constructor(
    private emailsApiService: EmailsApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.messageService.setMessage('No emails created yet')
    this.getEmails()
  }

  onSelect(email){
    this.editEmail = email
  }

  openEdit(email){
    this.onSelect(email)
    this.router.navigate([`/workspaces/${this.workspaceId}/emails/${email.id}`], {state: email})
  }
  

  openDelete(email){
    this.onSelect(email)
    const modalRef = this.modalService.open(DelEmailComponent, { backdrop: 'static' });
    modalRef.componentInstance.editEmail = this.editEmail;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.emails.indexOf(data);
        if (index !== -1) {
          this.emails.splice(index, 1);
        }        
      }
    );
  }
  

  cloneEmail(email){
    this.loading = true;
    this.onSelect(email)
    const newEmail = Object.assign({}, this.editEmail);
    newEmail.name = "Copy - " + newEmail.name;
    this.emailsApiService.postEmail(
      this.workspaceId, newEmail.name, newEmail.html, newEmail.subject, newEmail.track
    ).pipe(first())
    .subscribe(
        data => {
          this.loading = false;
          if (data['success'] == false) {
            this.sendAlert(newEmail.name)
          } else {
            this.emails.unshift(data)
          }
        },
        error => {
            console.log(error)
        });
  }

  getEmails(): void {
    this.loading = true;
    this.emailsApiService.getEmails(this.workspaceId)
      .subscribe(
        emails => {
          this.emails = emails;
          this.loading = false;
        })
  }

  sendAlert(name) {
    this.alertService.newAlert("warning", "An email named " + name + " already exists in the database")
  }

  import() {
    const modalRef = this.modalService.open(ImportModuleComponent, { backdrop: 'static' });
    modalRef.componentInstance.type = 'Email'
    modalRef.componentInstance.emitter.subscribe(data => this.cloneEmail(data));
  }

}
