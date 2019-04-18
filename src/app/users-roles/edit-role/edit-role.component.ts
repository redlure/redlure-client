import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RolesApiService } from '../roles-api.service'
import { first } from 'rxjs/operators'
import { Role } from '../role.model'
import { AlertService } from '../../alert/alert.service'
import { WorkspacesApiService } from '../../workspaces/workspaces-api.service'
import { Workspace } from '../../workspaces/workspace.model'

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html'
})

export class EditRoleComponent implements OnInit {
  loading = false
  workspaces: Workspace[];
  currentWorkspaceIds: Number[];
  @Input() editRole: Role;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  headers = ["Workspace", "Access"]

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rolesApiService: RolesApiService,
    private alertService: AlertService,
    private workspacesApiService: WorkspacesApiService,
  ) { }

  ngOnInit() {
    this.workspacesApiService.getWorkspaces().subscribe(data => this.workspaces = data);
    this.currentWorkspaceIds = this.editRole.workspaces.map( data => data.id);
  }

  closeModal() {
    this.activeModal.close();
  }

  accessChange(event, workspace) {
    if (event.target.checked) {
      this.currentWorkspaceIds.push(workspace.id)
    } else {
      const index: number = this.currentWorkspaceIds.indexOf(workspace.id);
      this.currentWorkspaceIds.splice(index, 1);
    }
  }

  saveRole() {
    this.loading = true;
    this.rolesApiService.putRole(String(this.editRole.id), this.currentWorkspaceIds)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.editRole = data
                this.emitter.emit(this.editRole)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
  }

}