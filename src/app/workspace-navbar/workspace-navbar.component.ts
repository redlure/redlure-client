import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { WorkspacesApiService } from '../workspaces/workspaces-api.service'

@Component({
  selector: 'workspace-navbar',
  templateUrl: './workspace-navbar.component.html',
  styleUrls: ['./workspace-navbar.component.css']
})
export class WorkspaceNavbarComponent implements OnInit {

  workspaceId: String;
  workspace = {name: null};

  constructor(
    private route: ActivatedRoute,
    private workspacesApiService: WorkspacesApiService
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.getWorkspace()
  }

  getWorkspace(): void {
    this.workspacesApiService.getWorkspace(this.workspaceId)
      .subscribe(workspace => this.workspace = workspace);
  }

}
