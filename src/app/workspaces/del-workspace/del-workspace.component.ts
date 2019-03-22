import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private workspacesApiService: WorkspacesApiService,
  ) { }

  ngOnInit() {
    console.log(this.editWorkspace.name)
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteWorkspace() {
    this.workspacesApiService.deleteWorkspace(this.editWorkspace.id)
      .pipe(first())
        .subscribe(
            data => {
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}
