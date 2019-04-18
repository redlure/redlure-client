import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UsersApiService } from '../users-api.service'
import { first } from 'rxjs/operators'
import { User } from '../user.model'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-del-user',
  templateUrl: './del-user.component.html'
})

export class DelUserComponent implements OnInit {
  @Input() editUser: User;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private usersApiService: UsersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {

  }

  closeModal() {
    this.activeModal.close();
  }

  deleteUser() {
    this.usersApiService.deleteUser(String(this.editUser.id))
      .pipe(first())
        .subscribe(
            data => {
                // check for delete success
                if (data['success'] == false) {
                  this.alertService.newAlert("warning", "The logged in user cannot be deleted")
                  this.closeModal()
                // delete the user
                } else {
                  this.emitter.emit(this.editUser)
                  this.closeModal()
                }
            },
            error => {
                console.log(error)
            });
            
}

}