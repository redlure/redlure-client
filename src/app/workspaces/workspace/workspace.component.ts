import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  workspaceId: String;

  constructor(
    private route: ActivatedRoute
  ) { 
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
  }

  ngOnInit() {
  }
}