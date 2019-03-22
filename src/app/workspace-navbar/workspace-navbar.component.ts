import { Component, OnInit } from '@angular/core';
import { WorkspaceComponent } from '../workspaces/workspace/workspace.component'

@Component({
  selector: 'workspace-navbar',
  templateUrl: './workspace-navbar.component.html',
  styleUrls: ['./workspace-navbar.component.css']
})
export class WorkspaceNavbarComponent implements OnInit {
  baseUrl: String;

  constructor(workspaceComponent: WorkspaceComponent) {
    this.baseUrl = workspaceComponent.baseUrl
   }

  ngOnInit() {
  }

}
