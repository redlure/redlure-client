import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { WorkspacesApiService } from '../workspaces-api.service'
import { first } from 'rxjs/operators'
import { Workspace } from '../workspace.model'


@Component({
  selector: 'app-del-workspace',
  templateUrl: './del-workspace.component.html',
  styleUrls: ['./del-workspace.component.css']
})
export class DelWorkspaceComponent implements OnInit {

  @Input() editWorkspace: Workspace;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private workspacesApiService: WorkspacesApiService,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteWorkspace() {
    this.workspacesApiService.deleteWorkspace(this.editWorkspace.id)
      .pipe(first())
        .subscribe(
            data => {
                this.emitter.emit(this.editWorkspace)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}
