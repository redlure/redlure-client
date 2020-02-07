import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RolesApiService } from '../roles-api.service'
import { first } from 'rxjs/operators'
import { Role } from '../role.model'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-del-role',
  templateUrl: './del-role.component.html'
})

export class DelRoleComponent implements OnInit {
  loading = false;
  @Input() editRole: Role;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rolesApiService: RolesApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {

  }

  closeModal() {
    this.activeModal.close();
  }

  deleteRole() {
    this.loading = true;
    this.rolesApiService.deleteRole(String(this.editRole.id))
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                // check for delete success
                if (data['success'] == false) {
                  this.alertService.newAlert("warning", "The role of the logged in user cannot be deleted")
                  this.closeModal()
                // delete the role
                } else {
                  this.emitter.emit(this.editRole)
                  this.closeModal()
                }
            },
            error => {
                console.log(error)
            });
            
  }

}