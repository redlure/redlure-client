import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersApiService } from '../users-api.service'
import { first } from 'rxjs/operators'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  editUser: Object;
  match = true;


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private usersApiService: UsersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
      return;
    }

    // check if passwords match
    if (this.f.password.value != this.f.password2.value) {
      this.match = false;
      return;
    }

    this.loading = true;
    this.match = true;
    this.usersApiService.resetPassword(this.editUser['id'], this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "Failed to reset password")
          } else {
            this.alertService.newAlert("success", "Password updated")
            this.closeModal()
          }
        },
        error => {
          this.loading = false;
          console.log(error)
        });
  }

}
