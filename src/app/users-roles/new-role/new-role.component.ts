import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesApiService } from '../roles-api.service'
import { first } from 'rxjs/operators'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
})

export class NewRoleComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newRole: Object;
  roles: Object[];

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private rolesApiService: RolesApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.loading = true;
      this.rolesApiService.postRole(this.formControls.name.value, this.formControls.type.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.alertService.newAlert("warning", this.formControls.name.value + " is an existing role")
            } else {
              this.newRole = data;
              this.emitter.emit(this.newRole);
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
