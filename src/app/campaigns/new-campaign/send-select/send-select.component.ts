import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
  consoleTime: Date = null;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private newCampaignService: NewCampaignService,
    private campaignsApiService: CampaignsApiService,
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    var converted = new Date(new Date(this.newCampaignService.allModules["console_time"]).getTime() + new Date(this.newCampaignService.allModules["console_time"]).getTimezoneOffset() * 60000)
    const offset = converted.valueOf() - this.newCampaignService.allModules["client_time"].valueOf()
    this.consoleTime = new Date(Date.now() + offset);
    this.myForm = this.formBuilder.group({
      profile: [this.newCampaignService.newCampaign.profile, Validators.required],
      targetList: [this.newCampaignService.newCampaign.list, Validators.required],
      startDate: [this.newCampaignService.newCampaign.startDate, DateTimeValidator],
      batchNumber: [this.newCampaignService.newCampaign.batchNumber, Validators.pattern('[0-9]*')],
      batchInterval: [this.newCampaignService.newCampaign.batchInterval, Validators.pattern('[0-9]*')],
    });
  }

  get formControls() { return this.myForm.controls; }

  closeModal() {
    this.activeModal.close();
  }

  backModal() {
    this.emitter.emit("back");
    this.activeModal.close();
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.newCampaignService.newCampaign.profile = this.formControls.profile.value;
      this.newCampaignService.newCampaign.list = this.formControls.targetList.value;
      this.newCampaignService.newCampaign.batchInterval = this.formControls.batchInterval.value;
      this.newCampaignService.newCampaign.batchNumber = this.formControls.batchNumber.value;
      this.newCampaignService.newCampaign.startDate = this.formControls.startDate.value;

      this.postCampaign();
    }
  }


  postCampaign() {
    this.loading = true;
    let nc = this.newCampaignService.newCampaign;
    this.campaignsApiService.postCampaign(this.workspaceId, nc.name, nc.email, nc.profile,
      nc.list, nc.batchNumber, nc.batchInterval, nc.startDate, nc.domain, nc.server,
      nc.port, nc.ssl, nc.pages, nc.redirectUrl, nc.safetyUrl, nc.payloadUrl, nc.payloadFile, nc.attachment
    ).pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data['success'] == false) {
            this.failed = true;;
            this.failMsg = data['msg'];
          } else {
            this.emitter.emit(data['campaign']);
            this, this.activeModal.close();
          }
        },
        error => {
          console.log(error)
        });
  }

}

// Validator for Date and Time
export const DateTimeValidator = (fc: FormControl) => {
  if (fc.value == "" || fc.value == null) {
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
