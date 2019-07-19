import { Component, OnInit, Input } from '@angular/core';

import { Workspace } from './workspace.model';
import { WorkspacesApiService } from './workspaces-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewWorkspaceComponent } from './new-workspace/new-workspace.component';
import { DelWorkspaceComponent } from './del-workspace/del-workspace.component';
import { setName } from '../env'

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  providers: [ WorkspacesApiService ]
  //styleUrls: ['./Workspacees.component.css']
})
export class WorkspacesComponent implements OnInit {
  workspaces: Workspace[];
  @Input() editWorkspace: Workspace; // the Workspace currently being edited

  constructor(
    private workspacesApiService: WorkspacesApiService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getWorkspaces();
  }

  onSelect(workspace: Workspace): void {
    this.editWorkspace = workspace;
  }

  openNewModal() {
    const modalRef = this.modalService.open(NewWorkspaceComponent);
    modalRef.componentInstance.emitter.subscribe(data => this.workspaces.unshift(data));
  }

  openDeleteModal(workspace) {
    this.onSelect(workspace)
    const modalRef = this.modalService.open(DelWorkspaceComponent);
    modalRef.componentInstance.editWorkspace = this.editWorkspace;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.workspaces.indexOf(data);
        if (index !== -1) {
          this.workspaces.splice(index, 1);
        }        
      }
    );
  }

  getWorkspaces(): void {
    this.workspacesApiService.getWorkspaces()
      .subscribe(workspaces => this.workspaces = workspaces);
  }

  enterWs(name) {
    setName(name)
  }
  
}
