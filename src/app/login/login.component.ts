import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from './api.service'
import { LoginApiService } from './login-api.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  failed = false;

  loginForm: FormGroup;
  serverUrl: String;

  failMsg = '';
  returnUrl = 'workspaces';


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginApiService: LoginApiService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // prepopulate server field if found in localstorage
    if (localStorage.getItem('apiUrl')) {
      this.serverUrl = localStorage.getItem('apiUrl');
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      server: [this.serverUrl, Validators.required]
    });
  }

  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      // set the URL for the redlure server API
      this.apiService.setUrl(this.formControls.server.value.replace(/\/$/, ""));

      this.loading = true;
      this.loginApiService.login(this.formControls.username.value, this.formControls.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success']) {
              this.router.navigate([this.returnUrl]);
              this.failed = false;
            } else if (data['success'] == false) {
              this.failed = true;
              this.failMsg = 'Invalid username or password';
            } else {
              this.failed = true;
              this.failMsg = 'Server is unreachable';
            }
          },
          error => {
            this.loading = false;
          });
    }
  }
}
