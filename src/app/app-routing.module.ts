import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { WorkspacesComponent }   from './workspaces/workspaces.component';
import { LoginComponent } from './login/login.component'
import { WorkspaceComponent } from './workspaces/workspace/workspace.component'
import { ProfilesComponent } from './profiles/profiles.component'
import { DomainsServersComponent } from './domains-servers/domains-servers.component'
import { UsersRolesComponent } from './users-roles/users-roles.component';
import { PagesComponent } from './pages/pages.component';
import { PageComponent } from './pages/page/page.component'
import { EmailsComponent } from './emails/emails.component';
import { EmailComponent } from './emails/email/email.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent },
  { path: 'workspaces', component: WorkspacesComponent },
  { path: 'domains-servers', component:  DomainsServersComponent },
  { path: 'users-roles', component: UsersRolesComponent },
  { path: 'workspaces/:workspaceId', component: WorkspaceComponent },
  { path: 'workspaces/:workspaceId/profiles', component: ProfilesComponent },
  { path: 'workspaces/:workspaceId/pages', component: PagesComponent },
  { path: 'workspaces/:workspaceId/pages/:pageId', component: PageComponent },
  { path: 'workspaces/:workspaceId/emails', component: EmailsComponent },
  { path: 'workspaces/:workspaceId/emails/:emailId', component: EmailComponent },
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}