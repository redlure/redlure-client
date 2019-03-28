import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { WorkspacesComponent }   from './workspaces/workspaces.component';
import { LoginComponent } from './login/login.component'
import { WorkspaceComponent } from './workspaces/workspace/workspace.component'
import { ProfilesComponent } from './profiles/profiles.component'
import { DomainsServersComponent } from './domains-servers/domains-servers.component'
import { UsersRolesComponent } from './users-roles/users-roles.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent },
  { path: 'workspaces', component: WorkspacesComponent },
  { path: 'domains-servers', component:  DomainsServersComponent },
  { path: 'users-roles', component: UsersRolesComponent },
  { path: 'workspaces/:workspaceId', component: WorkspaceComponent },
  { path: 'workspaces/:workspaceId/profiles', component: ProfilesComponent },
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}