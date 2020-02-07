import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProfilesApiService } from '../profiles-api.service'
import { first } from 'rxjs/operators'
import { Profile } from '../profile.model'

@Component({
  selector: 'app-del-profile',
  templateUrl: './del-profile.component.html'
})
export class DelProfileComponent implements OnInit {
  loading = false;
  workspaceId: String;
  @Input() editProfile: Profile;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private profilesApiService: ProfilesApiService,
  ) { }

  ngOnInit() {
    this.workspaceId = this.router.url.split('/')[2];
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteProfile() {
    this.loading = true;
    this.profilesApiService.deleteProfile(this.workspaceId, String(this.editProfile.id))
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.emitter.emit(this.editProfile);
                this.closeModal();
            },
            error => {
                console.log(error)
            });
            
}

}