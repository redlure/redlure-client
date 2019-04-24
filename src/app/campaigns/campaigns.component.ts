import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignsApiService } from './campaigns-api.service'
import { Campaign } from './campaign.model';

import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html'
})
export class CampaignsComponent implements OnInit {
  workspaceId: String;
  campaigns: Campaign[];
  editCampaign: Campaign;

  constructor(
    private campaignsApiService: CampaignsApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
   }

  ngOnInit() {
    this.getCampaigns()
  }

  onSelect(campaign){
    this.editCampaign = campaign
  }

  openEdit(campaign) {
    this.onSelect(campaign)
    this.router.navigate([`/workspaces/${this.workspaceId}/campaigns/${campaign.id}`], {state: campaign})
  }

  getCampaigns() {
    this.campaignsApiService.getCampaigns(this.workspaceId)
      .subscribe(campaigns => this.campaigns = campaigns);
  }

}
