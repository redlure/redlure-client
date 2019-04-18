import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private usersApiService: UsersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      role: ['', Validators.required]
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
    
    this.loading = true;
    this.usersApiService.postUser(this.f.username.value, this.f.password.value, this.f.role.value)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                if (data['success'] == false) {
                  this.alertService.newAlert("warning", this.f.username.value + " is an existing user")
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
