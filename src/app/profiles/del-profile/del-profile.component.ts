import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProfilesApiService } from '../profiles-api.service'
import { first } from 'rxjs/operators'
import { Profile } from '../profile.model'

@Component({
  selector: 'app-del-profile',
  templateUrl: './del-profile.component.html',
  styleUrls: ['./del-profile.component.css']
})
export class DelProfileComponent implements OnInit {
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
    this.profilesApiService.deleteProfile(this.workspaceId, String(this.editProfile.id))
      .pipe(first())
        .subscribe(
            data => {
                this.emitter.emit(this.editProfile)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}