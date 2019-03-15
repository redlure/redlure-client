import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { LoginComponent } from './login/login.component';
import { LoginApiService } from './login/login-api.service'
import { HttpErrorHandler }     from './http-error-handler.service';
import { MessageService }       from './message.service';

import { AppRoutingModule }     from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md'

@NgModule({
  declarations: [
    AppComponent,
    WorkspacesComponent,
    LoginComponent,
    NavbarComponent
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
    MDBBootstrapModule
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
    LoginApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
