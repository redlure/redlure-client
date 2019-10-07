import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesApiService } from './profiles-api.service';
import { Profile } from './profile.model';

import { DelProfileComponent } from './del-profile/del-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { TestProfileComponent } from './test-profile/test-profile.component';
import { AlertService } from '../alert/alert.service';
import { first } from 'rxjs/operators';
import { MessageService } from '../empty-object/message.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  providers: [ ProfilesApiService, MessageService ]
})
export class ProfilesComponent implements OnInit {
  workspaceId: String;
  profiles: Profile[];
  editProfile: Profile; // the Workspace currently being edited

  constructor(
    private profilesApiService: ProfilesApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.messageService.setMessage('No profiles created yet')
    this.getProfiles()
  }

  onSelect(profile){
    this.editProfile = profile
  }

  openNew(){
    const modalRef = this.modalService.open(NewProfileComponent, { size: 'lg' });
    modalRef.componentInstance.emitter.subscribe(data => this.profiles.unshift(data));
  }

  openEdit(profile){
    this.onSelect(profile)
    const modalRef = this.modalService.open(EditProfileComponent, { size: 'lg' });
    modalRef.componentInstance.editProfile = this.editProfile;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.profiles.indexOf(this.editProfile);
        if (index !== -1) {
          this.profiles[index] = data
        }        
      }
    );
  }

  openTest(profile){
    this.onSelect(profile)
    const modalRef = this.modalService.open(TestProfileComponent);
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

  cloneProfile(profile){
    this.onSelect(profile)
    const newProfile = Object.assign({}, this.editProfile);
    newProfile.name = "Copy - " + newProfile.name;
    this.profilesApiService.postProfile(
      this.workspaceId, newProfile.name, newProfile.from_address, newProfile.smtp_host, newProfile.smtp_port,
      newProfile.username, newProfile.password, newProfile.tls, newProfile.ssl
    ).pipe(first())
    .subscribe(
        data => {
          if (data['success'] == false) {
            this.sendAlert(newProfile.name)
          } else {
            this.profiles.unshift(data)
          }
        },
        error => {
            console.log(error)
        });
  }

  getProfiles(): void {
    this.profilesApiService.getProfiles(this.workspaceId)
      .subscribe(profiles => this.profiles = profiles);
  }

  sendAlert(name) {
    this.alertService.newAlert("warning", name + " is an already existing profile")
  }

}
