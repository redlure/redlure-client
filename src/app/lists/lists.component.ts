import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListsApiService } from './lists-api.service'
import { List } from './list.model';

import { DelListComponent } from './del-list/del-list.component'
import { EditListComponent } from './edit-list/edit-list.component'
import { NewListComponent } from './new-list/new-list.component'
import { AlertService } from '../alert/alert.service'
import { first } from 'rxjs/operators'
import { MessageService } from '../empty-object/message.service';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  providers: [ ListsApiService, MessageService ]
})
export class ListsComponent implements OnInit {
  workspaceId: String;
  lists: List[] = [];
  editList: List; // the Workspace currently being edited

  constructor(
    private listsApiService: ListsApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.messageService.setMessage('No lists created yet')
    this.getLists()
  }

  onSelect(list){
    this.editList = list
  }

  openNew(){
    const modalRef = this.modalService.open(NewListComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emitter.subscribe(data => this.lists.unshift(data));
  }

  openEdit(list){
    this.onSelect(list)
    const modalRef = this.modalService.open(EditListComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.editList = this.editList;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.lists.indexOf(this.editList);
        if (index !== -1) {
          this.lists[index] = data
        }        
      }
    );
  }

  openDelete(list){
    this.onSelect(list)
    const modalRef = this.modalService.open(DelListComponent, { backdrop: 'static' });
    modalRef.componentInstance.editList = this.editList;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.lists.indexOf(data);
        if (index !== -1) {
          this.lists.splice(index, 1);
        }        
      }
    );
  }

  cloneList(list){
    this.onSelect(list)
    const newList = Object.assign({}, this.editList);
    newList.name = "Copy - " + newList.name;
    this.listsApiService.postList(
      this.workspaceId, newList.name, newList.targets
    ).pipe(first())
    .subscribe(
        data => {
          if (data['success'] == false) {
            this.sendAlert(newList.name)
          } else {
            this.lists.unshift(data)
          }
        },
        error => {
            console.log(error)
        });
  }

  getLists(): void {
    this.listsApiService.getLists(this.workspaceId)
      .subscribe(lists => this.lists = lists);
  }

  sendAlert(name) {
    this.alertService.newAlert("warning", "A list with the name " + name + " already exists in the database")
  }

}
