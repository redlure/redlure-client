import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CampaignsApiService } from '../../campaigns-api.service';
import { AlertService } from '../../../alert/alert.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewCampaignService } from '../new-campaign.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-send-select',
  templateUrl: './send-select.component.html',
})
export class SendSelectComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  failed = false;
  failMsg = "";
  workspaceId: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private newCampaignService: NewCampaignService,
    private campaignsApiService: CampaignsApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      profile: [this.newCampaignService.newCampaign.profile, Validators.required],
      targetList: [this.newCampaignService.newCampaign.list, Validators.required],
      startDate: [this.newCampaignService.newCampaign.startDate, DateTimeValidator],
      batchNumber: [this.newCampaignService.newCampaign.batchNumber, Validators.pattern('[0-9]*')],
      batchInterval: [this.newCampaignService.newCampaign.batchInterval, Validators.pattern('[0-9]*')],
    });
  }

  get f() { return this.myForm.controls; }

  closeModal() {
    this.activeModal.close();
  }

  backModal() {
    this.emitter.emit("back");
    this.activeModal.close();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }

    //set values to newCampaign object

    this.newCampaignService.newCampaign.profile = this.f.profile.value;
    this.newCampaignService.newCampaign.list = this.f.targetList.value;
    this.newCampaignService.newCampaign.batchInterval = this.f.batchInterval.value;
    this.newCampaignService.newCampaign.batchNumber = this.f.batchNumber.value;
    this.newCampaignService.newCampaign.startDate = this.f.startDate.value;

    this.postCampaign();
  }


  postCampaign() {
    console.log('posintg')
    this.loading = true;
    let nc = this.newCampaignService.newCampaign;
    this.campaignsApiService.postCampaign(this.workspaceId, nc.name, nc.email, nc.profile,
      nc.list, nc.batchNumber, nc.batchInterval, nc.startDate, nc.domain,
      nc.server, nc.port, nc.ssl, nc.pages, nc.redirectUrl, nc.payloadUrl
      ).pipe(first())
      .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.failed = true;;
              this.failMsg = data['msg'];
            } else {
              this.emitter.emit(data['campaign']);
              this,this.activeModal.close();
            }
          },
          error => {
              console.log(error)
          });

  }

}

// Validator for Date and Time
export const DateTimeValidator = (fc: FormControl) => {
  if (fc.value == "" || fc.value == null){
    return true
  }
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
      isValid: {
          valid: false
      }
  };
}