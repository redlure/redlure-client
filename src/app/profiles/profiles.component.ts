import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesApiService } from './profiles-api.service'
import { Profile } from './profile.model';

import { DelProfileComponent } from './del-profile/del-profile.component'
import { EditProfileComponent } from './edit-profile/edit-profile.component'
import { NewProfileComponent } from './new-profile/new-profile.component'


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  providers: [ ProfilesApiService ]
})
export class ProfilesComponent implements OnInit {
  workspaceId: String;
  profiles: Profile[];
  editProfile: Profile; // the Workspace currently being edited
  baseUrl: String;


  constructor(
    private profilesApiService: ProfilesApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
    this.baseUrl = `workspaces/${this.workspaceId}/profiles`
   }

  ngOnInit() {
    this.getProfiles()
  }

  onSelect(profile){
    this.editProfile = profile
  }

  openNew(){
    const modalRef = this.modalService.open(NewProfileComponent);
    modalRef.componentInstance.emitter.subscribe(data => this.profiles.unshift(data));
  }

  openEdit(profile){
    this.onSelect(profile)
    const modalRef = this.modalService.open(EditProfileComponent);
    modalRef.componentInstance.editProfile = this.editProfile;
  }

  openDelete(profile){
    this.onSelect(profile)
    const modalRef = this.modalService.open(DelProfileComponent);
    modalRef.componentInstance.editProfile = this.editProfile;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.profiles.indexOf(data);
        if (index !== -1) {
          this.profiles.splice(index, 1);
        }        
      }
    );
  }

  getProfiles(): void {
    this.profilesApiService.getProfiles(this.workspaceId)
      .subscribe(profiles => this.profiles = profiles);
  }

}
