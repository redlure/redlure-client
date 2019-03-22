import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginApiService } from './login-api.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = 'workspaces';
  invalidLogon = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginApiService: LoginApiService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.loginApiService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
                if(data['success']){
                  this.router.navigate([this.returnUrl]);
                  this.invalidLogon = false;
                } else {
                  this.invalidLogon = true;
                  this.loading = false;
                }
            },
            error => {
                //console.log(error)
                this.loading = false;
            });
}

}
