import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagesApiService } from './pages-api.service'
import { Page } from './page.model';
import { DelPageComponent } from './del-page/del-page.component'
//import { EditPageComponent } from './edit-page/edit-page.component'
//import { NewPageComponent } from './new-page/new-page.component'
import { AlertService } from '../alert/alert.service'
import { first } from 'rxjs/operators'
import { MessageService } from '../empty-object/message.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  providers: [ PagesApiService, MessageService ]
})
export class PagesComponent implements OnInit {
  workspaceId: String;
  pages: Page[];
  editPage: Page; // the Workspace currently being edited

  constructor(
    private pagesApiService: PagesApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.messageService.setMessage('No pages created yet')
    this.getPages()
  }

  onSelect(page){
    this.editPage = page
  }

  openEdit(page){
    this.onSelect(page)
    this.router.navigate([`/workspaces/${this.workspaceId}/pages/${page.id}`], {state: page})
  }

  pagePreview(page) {
    let newWindow = window.open()
    newWindow.document.write(page.html)
  }
  

  openDelete(page){
    this.onSelect(page)
    const modalRef = this.modalService.open(DelPageComponent);
    modalRef.componentInstance.editPage = this.editPage;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.pages.indexOf(data);
        if (index !== -1) {
          this.pages.splice(index, 1);
        }        
      }
    );
  }
  

  clonePage(page){
    this.onSelect(page)
    const newPage = Object.assign({}, this.editPage);
    newPage.name = "Copy - " + newPage.name;
    this.pagesApiService.postPage(
      this.workspaceId, newPage.name, newPage.html, newPage.url
    ).pipe(first())
    .subscribe(
        data => {
          if (data['success'] == false) {
            this.sendAlert(newPage.name)
          } else {
            this.pages.unshift(data)
          }
        },
        error => {
            console.log(error)
        });
  }

  getPages(): void {
    this.pagesApiService.getPages(this.workspaceId)
      .subscribe(pages => this.pages = pages)
  }

  sendAlert(name) {
    this.alertService.newAlert("warning", "A page named " + name + " already exists in the database")
  }

}
