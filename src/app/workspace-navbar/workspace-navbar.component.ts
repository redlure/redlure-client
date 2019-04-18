import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'workspace-navbar',
  templateUrl: './workspace-navbar.component.html',
  styleUrls: ['./workspace-navbar.component.css']
})
export class WorkspaceNavbarComponent implements OnInit {

  workspaceId: String;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
  }

}
