import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersApiService } from '../users-api.service'
import { first } from 'rxjs/operators'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newUser: Object;
  roles: Object[];
  match = true;

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private usersApiService: UsersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      if (this.formControls.password.value !== this.formControls.password2.value) {
        this.match = false;
        return;
      }

      this.match = true;
      this.loading = true;
      this.usersApiService.postUser(this.formControls.username.value, this.formControls.password.value, this.formControls.role.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.alertService.newAlert('warning', this.formControls.username.value + ' is an existing user');
            } else {
              this.newUser = data;
              this.emitter.emit(this.newUser);
              this.closeModal()
            }
          },
          error => {
            this.loading = false;
            console.log(error)
          });
    }
  }
}
