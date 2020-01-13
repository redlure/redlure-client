import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordResetComponent } from '../../users-roles/password-reset/password-reset.component';
import { UserProfileApiService } from './user-profile-api.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  currentUser: Object = {};
  role: String = "";
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public userProfileApiService: UserProfileApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.userProfileApiService.getCurrentUser()
      .subscribe(
        data => { 
          this.currentUser = data; 
          this.role = data['role']['name']
          this.loading = false;
        }
      );
  }

  closeModal() {
    this.activeModal.close();
  }

  resetPassword() {
    const modalRef = this.modalService.open(PasswordResetComponent, { backdrop: 'static' });
    modalRef.componentInstance.editUser = this.currentUser;
  }

}
