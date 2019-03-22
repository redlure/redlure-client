import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { ProfilesApiService } from './profiles-api.service'
import { Profile } from './profile.model';


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
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
    this.baseUrl = `workspaces/${this.workspaceId}/profiles`
   }

  ngOnInit() {
    this.getProfiles()
  }

  getProfiles(): void {
    this.profilesApiService.getProfiles(this.workspaceId)
      .subscribe(profiles => this.profiles = profiles);
  }

}
