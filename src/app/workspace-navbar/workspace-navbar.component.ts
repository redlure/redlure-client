import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { WorkspacesApiService } from '../workspaces/workspaces-api.service'
import { wsName, setName } from '../env'
import { first } from 'rxjs/operators'
import { LoginApiService } from '../login/login-api.service'

@Component({
  selector: 'workspace-navbar',
  templateUrl: './workspace-navbar.component.html',
  styleUrls: ['./workspace-navbar.component.css']
})
export class WorkspaceNavbarComponent implements OnInit {

  workspaceId: String;
  workspaceName;

  constructor(
    private route: ActivatedRoute,
    private workspacesApiService: WorkspacesApiService,
    private loginApiService: LoginApiService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    if (wsName == null) {
      this.getWorkspace();
    } else {
      this.workspaceName = wsName;
    }
  }

  
  getWorkspace(): void {
    this.workspacesApiService.getWorkspace(this.workspaceId)
      .subscribe(workspace => {
        setName(workspace.name);
        this.workspaceName = wsName;
      });
  }

  logout() {
    this.loginApiService.logout()
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login'])
        },
        error => {
          console.log(error)
        });
  }
}
