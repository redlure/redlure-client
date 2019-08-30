import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignsApiService } from './campaigns-api.service'
import { Campaign } from './campaign.model';
import { DelCampaignComponent } from './del-campaign/del-campaign.component'

import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html'
})
export class CampaignsComponent implements OnInit {
  workspaceId: String;
  campaigns: Campaign[];
  editCampaign: Campaign;
  loading=false;
  
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

  openDelete(campaign){
    this.onSelect(campaign)
    const modalRef = this.modalService.open(DelCampaignComponent);
    modalRef.componentInstance.editCampaign = this.editCampaign;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.campaigns.indexOf(data);
        if (index !== -1) {
          this.campaigns.splice(index, 1);
        }        
      }
    );
  }

  getCampaigns() {
    this.campaignsApiService.getCampaigns(this.workspaceId)
      .subscribe(campaigns => this.campaigns = campaigns);
  }

  launchCampaign(campaign) {
    this.loading = true
    this.campaignsApiService.launchCampaign(this.workspaceId, String(campaign.id))
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data['success']){
            this.router.navigate([`/workspaces/${this.workspaceId}/results`])
          } else {
            if (data['reasonCode'] == 4) {
              this.alertService.newAlert('danger', 'Failed to start campaign: the chosen server is not online');
            }
          }
        }
      );
  }

  killCampaign(campaign) {
    this.loading = true;
    this.campaignsApiService.killCampaign(this.workspaceId, String(campaign.id))
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data['success']){
            campaign.status = 'Completed'
          } else {
            this.alertService.newAlert('danger', 'Failed to stop campaign on worker');
          }
        }
      );
  }

}
