import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsersApiService } from '../users-api.service'
import { first } from 'rxjs/operators'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-change-user-role',
  templateUrl: './change-user-role.component.html'
})
export class ChangeUserRoleComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  editUser: Object;
  roles: Object[];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private usersApiService: UsersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    const index: number = this.roles.indexOf(this.roles.find(i => i['id'] === this.editUser['role']['id']));
      if (index !== -1) {
        this.roles.splice(index, 1);
      }
    this.myForm = this.formBuilder.group({
      role: ['', Validators.required],
    });
  }

  get formControls() { return this.myForm.controls; }

  closeModal() {
    this.activeModal.close();
  }

  onSubmit(){
    this.loading = true;
    this.usersApiService.changeUserRole(this.editUser['id'], this.formControls.role.value)
    .pipe(first())
        .subscribe(
            data => {
              this.loading = false;
              if (data['success'] == false) {
                this.alertService.newAlert("danger", data['msg'])
              } else {
                //this.alertService.newAlert("success", "Role updated")
                let role = this.roles.find(i => i['id'] === Number(this.formControls.role.value))
                this.editUser['role'] = role
                this.closeModal()
              }
            },
            error => {
                console.log(error)
            });

  }

}
