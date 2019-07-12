import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { ApiService } from './login/api.service'
import { AppComponent } from './app.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { LoginComponent } from './login/login.component';
import { LoginApiService } from './login/login-api.service'
import { HttpErrorHandler }     from './http-error-handler.service';
import { MessageService }       from './message.service';

import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { WorkspaceNavbarComponent } from './workspace-navbar/workspace-navbar.component';
import { NewWorkspaceComponent } from './workspaces/new-workspace/new-workspace.component'
import { WorkspacesApiService } from './workspaces/workspaces-api.service';
import { WorkspaceComponent } from './workspaces/workspace/workspace.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { DomainsServersComponent } from './domains-servers/domains-servers.component';
import { NewServerComponent } from './domains-servers/new-server/new-server.component';
import { NewDomainComponent } from './domains-servers/new-domain/new-domain.component';
import { DomainsApiService } from './domains-servers/domains-api.service'
import { ServersApiService } from './domains-servers/servers-api.service';
import { PagesComponent } from './pages/pages.component';
import { DelWorkspaceComponent } from './workspaces/del-workspace/del-workspace.component';
import { DelServerComponent } from './domains-servers/del-server/del-server.component';
import { DelDomainComponent } from './domains-servers/del-domain/del-domain.component';
import { NewProfileComponent } from './profiles/new-profile/new-profile.component';
import { DelProfileComponent } from './profiles/del-profile/del-profile.component';
import { EditProfileComponent } from './profiles/edit-profile/edit-profile.component'
import { ProfilesApiService } from './profiles/profiles-api.service';
import { TestProfileComponent } from './profiles/test-profile/test-profile.component';
import { AlertComponent } from './alert/alert.component';
import { UsersRolesComponent } from './users-roles/users-roles.component'
import { UsersApiService } from './users-roles/users-api.service';
import { RolesApiService } from './users-roles/roles-api.service';
import { NewUserComponent } from './users-roles/new-user/new-user.component'
import { AlertService } from './alert/alert.service';
import { DelUserComponent } from './users-roles/del-user/del-user.component';
import { NewRoleComponent } from './users-roles/new-role/new-role.component';
import { DelRoleComponent } from './users-roles/del-role/del-role.component';
import { EditRoleComponent } from './users-roles/edit-role/edit-role.component';
import { PageComponent } from './pages/page/page.component'
import { DelPageComponent } from './pages/del-page/del-page.component'
import { PagesApiService } from './pages/pages-api.service';
import { CloneSiteComponent } from './pages/page/clone-site/clone-site.component';
import { EmailsComponent } from './emails/emails.component';
import { EmailComponent } from './emails/email/email.component';
import { DelEmailComponent } from './emails/del-email/del-email.component';
import { EmailsApiService } from './emails/emails-api.service';
import { EditCertsComponent } from './domains-servers/edit-certs/edit-certs.component';
import { ListsComponent } from './lists/lists.component';
import { NewListComponent } from './lists/new-list/new-list.component';
import { EditListComponent } from './lists/edit-list/edit-list.component';
import { DelListComponent } from './lists/del-list/del-list.component';
import { ListsApiService } from './lists/lists-api.service';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CampaignComponent } from './campaigns/campaign/campaign.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { ResultsComponent } from './results/results.component';
import { DelCampaignComponent } from './campaigns/del-campaign/del-campaign.component';
import { NewKeyComponent } from './domains-servers/new-key/new-key.component';
import { ResultsApiService } from './results/results-api.service'

import { JoditAngularModule } from 'jodit-angular';
import { NgxSummernoteModule } from 'ngx-summernote'


@NgModule({
  declarations: [
    AppComponent,
    WorkspacesComponent,
    LoginComponent,
    NavbarComponent,
    WorkspaceNavbarComponent,
    NewWorkspaceComponent,
    WorkspaceComponent,
    ProfilesComponent,
    DomainsServersComponent,
    NewServerComponent,
    NewDomainComponent,
    PagesComponent,
    DelWorkspaceComponent,
    DelServerComponent,
    DelDomainComponent,
    NewProfileComponent,
    DelProfileComponent,
    EditProfileComponent,
    TestProfileComponent,
    AlertComponent,
    UsersRolesComponent,
    NewUserComponent,
    DelUserComponent,
    NewRoleComponent,
    DelRoleComponent,
    EditRoleComponent,
    PageComponent,
    DelPageComponent,
    CloneSiteComponent,
    EmailsComponent,
    EmailComponent,
    DelEmailComponent,
    EditCertsComponent,
    ListsComponent,
    NewListComponent,
    EditListComponent,
    DelListComponent,
    CampaignsComponent,
    CampaignComponent,
    DateTimePickerComponent,
    ResultsComponent,
    DelCampaignComponent,
    NewKeyComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModule,
    AngularEditorModule,
    JoditAngularModule,
    NgxSummernoteModule
  ],
  providers: [
    ApiService,
    HttpErrorHandler,
    MessageService,
    LoginApiService,
    WorkspacesApiService,
    WorkspaceComponent,
    ServersApiService,
    DomainsApiService,
    ProfilesApiService,
    AlertComponent,
    UsersApiService,
    RolesApiService,
    AlertService,
    PagesApiService,
    EmailsApiService,
    ListsApiService,
    ResultsApiService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NewWorkspaceComponent,
    NewDomainComponent,
    NewServerComponent,
    DelWorkspaceComponent,
    DelServerComponent,
    DelDomainComponent,
    DelProfileComponent,
    NewProfileComponent,
    EditProfileComponent,
    TestProfileComponent,
    NewUserComponent,
    DelUserComponent,
    NewRoleComponent,
    DelRoleComponent,
    EditRoleComponent,
    DelPageComponent,
    CloneSiteComponent,
    DelEmailComponent,
    EditCertsComponent,
    NewListComponent,
    DelListComponent,
    EditListComponent,
    DelCampaignComponent,
    NewKeyComponent,
  ]
})
export class AppModule { }
