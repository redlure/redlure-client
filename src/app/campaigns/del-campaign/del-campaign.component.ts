import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CampaignsApiService } from '../campaigns-api.service'
import { first } from 'rxjs/operators'
import { Campaign } from '../campaign.model'

@Component({
  selector: 'app-del-campaign',
  templateUrl: './del-campaign.component.html'
})
export class DelCampaignComponent implements OnInit {
  workspaceId: String;
  @Input() editCampaign: Campaign;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private campaignsApiService: CampaignsApiService,
  ) { }

  ngOnInit() {
    this.workspaceId = this.router.url.split('/')[2];
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteCampaign() {
    this.campaignsApiService.deleteCampaign(this.workspaceId, String(this.editCampaign.id))
      .pipe(first())
        .subscribe(
            data => {
                this.emitter.emit(this.editCampaign)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}