import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { ResultsComponent } from './results/results.component';
import { DelCampaignComponent } from './campaigns/del-campaign/del-campaign.component';
import { NewKeyComponent } from './domains-servers/new-key/new-key.component';
import { ResultsApiService } from './results/results-api.service'

import { ChartsModule } from 'ng2-charts';
import { JoditAngularModule } from 'jodit-angular';
import { FormComponent } from './results/form/form.component';
import { PasswordResetComponent } from './users-roles/password-reset/password-reset.component';
import { ServerProcessesComponent } from './domains-servers/server-processes/server-processes.component';
import { GraphsComponent } from './results/graphs/graphs.component';
//import { TableComponent } from './results/table/table.component';
import { PieChartComponent } from './results/graphs/pie-chart/pie-chart.component'
import { DataService } from './results/data.service';
import { EmptyObjectComponent } from './empty-object/empty-object.component';
import { ServerSelectComponent } from './campaigns/new-campaign/server-select/server-select.component';
import { NewCampaignService } from './campaigns/new-campaign/new-campaign.service';
import { ScenarioSelectComponent } from './campaigns/new-campaign/scenario-select/scenario-select.component';
import { SendSelectComponent } from './campaigns/new-campaign/send-select/send-select.component';
import { DataTablesModule } from 'angular-datatables';
import { TableComponent } from './results/table/table.component';
import { ServerFilesComponent } from './domains-servers/server-files/server-files.component';
import { ProfileComponent } from './navbar/profile/profile.component';
import { UserProfileApiService } from './navbar/profile/user-profile-api.service';
import { ImportModuleComponent } from './import-module/import-module.component';
import { LineChartComponent } from './results/graphs/line-chart/line-chart.component';
import { DetailComponent } from './campaigns/detail/detail.component';
import { AnonymousComponent } from './results/anonymous/anonymous.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ChangeUserRoleComponent } from './users-roles/change-user-role/change-user-role.component';
import { VariableHelpComponent } from './variable-help/variable-help.component';


@NgModule({
  declarations: [
    AppComponent,
    WorkspacesComponent,
    LoginComponent,
    NavbarComponent,
    WorkspaceNavbarComponent,
    NewWorkspaceComponent,
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
    DateTimePickerComponent,
    ResultsComponent,
    DelCampaignComponent,
    NewKeyComponent,
    FormComponent,
    PasswordResetComponent,
    ServerProcessesComponent,
    GraphsComponent,
    TableComponent,
    PieChartComponent,
    EmptyObjectComponent,
    ServerSelectComponent,
    ScenarioSelectComponent,
    SendSelectComponent,
    ServerFilesComponent,
    ProfileComponent,
    ImportModuleComponent,
    LineChartComponent,
    DetailComponent,
    AnonymousComponent,
    ChangeUserRoleComponent,
    VariableHelpComponent,
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
    JoditAngularModule,
    ChartsModule,
    //NgbdTableSortableModule,
    DataTablesModule,
    CodemirrorModule
  ],
  providers: [
    ApiService,
    EmptyObjectComponent,
    HttpErrorHandler,
    MessageService,
    LoginApiService,
    WorkspacesApiService,
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
    DataService,
    NewCampaignService,
    UserProfileApiService
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
    FormComponent,
    PasswordResetComponent,
    ServerProcessesComponent,
    GraphsComponent,
    ServerSelectComponent,
    ScenarioSelectComponent,
    SendSelectComponent,
    TableComponent,
    ServerFilesComponent,
    ProfileComponent,
    ImportModuleComponent,
    LineChartComponent,
    DetailComponent,
    AnonymousComponent,
    ChangeUserRoleComponent,
    VariableHelpComponent
  ]
})
export class AppModule { }
