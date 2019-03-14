import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { WorkspacesComponent }   from './workspaces/workspaces.component';
import { LoginComponent } from './login/login.component'
 
const routes: Routes = [
  { path: '', redirectTo: '/workspaces', pathMatch: 'full' },
  { path: 'workspaces', component: WorkspacesComponent },
  { path: 'login',  component: LoginComponent}
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}