import { Component, OnInit } from '@angular/core';

import { Workspace } from './workspace.model';
import { WorkspacesApiService } from './workspaces-api.service';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  providers: [ WorkspacesApiService ]
  //styleUrls: ['./Workspacees.component.css']
})
export class WorkspacesComponent implements OnInit {
  workspaces: Workspace[];
  editWorkspace: Workspace; // the Workspace currently being edited

  constructor(private workspacesApiService: WorkspacesApiService) { }

  ngOnInit() {
    this.getWorkspacees();
  }

  getWorkspacees(): void {
    this.workspacesApiService.getWorkspaces()
      .subscribe(workspaces => this.workspaces = workspaces);
  }

  
}
