import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Campaign } from '../campaign.model'
import { CampaignsApiService } from '../campaigns-api.service'
import { AlertService } from '../../alert/alert.service'
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html'
})
export class CampaignComponent implements OnInit {
  editCampaign: any;
  track = true;

  workspaceId: String;
  campaignId: String;

  ssl: Boolean;

  myForm: FormGroup;
  loading = false;
  submitted = false;

  title1: String;
  title2: String;
  saveBtnText: String;

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private emailsApiService: CampaignsApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId']);
    this.route.params.subscribe(params => this.campaignId = params['campaignId']);
    if (this.campaignId != 'new') {
      this.editCampaign = router.getCurrentNavigation().extras.state
      if (this.editCampaign == null) {
        this.router.navigate([`/workspaces/${this.workspaceId}/campaigns`]);
      }
      this.track = this.editCampaign.track;
      this.title1 = "EDIT C";
      this.title2 = "AMPAIGN";
      this.saveBtnText = "Save";
    } else {
      this.editCampaign = this.initBlankCampaign();
      this.ssl = true;
      this.title1 = "NEW C";
      this.title2 = "AMPAIGN";
      this.saveBtnText = "Create";
    }
   }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      // campaign name
      name: [this.editCampaign.name, Validators.required],
      // email component
      email: [this.editCampaign.email.name, Validators.required],
      //page components
      page1: [this.editCampaign.pages[0],name],
      page2: [this.editCampaign.pages[1],name],
      page3: [this.editCampaign.pages[2],name],
      page4: [this.editCampaign.pages[3],name],
      //profile component
      profile: [this.editCampaign.profile.name, Validators.required],
      // domain component
      domain: [this.editCampaign.domain.domain, Validators.required],
      // server component
      server: [this.editCampaign.server.alias],
      // list component
      targetList: [this.editCampaign.targetList.name, Validators.required],
      // port the server (worker) will host off of
      port: [this.editCampaign.port, Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      // links to payload and final redirect
      payloadUrl: [this.editCampaign.payloadUrl],
      redirectUrl: [this.editCampaign.redirectUrl],
      // sending configs
      startDate: [this.editCampaign.startDate, DateTimeValidator],
      batchNumber: [this.editCampaign.batchNumber, Validators.pattern('[0-9]*')],
      batchInterval: [this.editCampaign.batchInterval, Validators.pattern('[0-9]*')],
    });
  }

  return() {
    this.router.navigate([`/workspaces/${this.workspaceId}/campaigns`])
  }

  sslChange(event){
    this.ssl = event.target.checked;
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true

    if (this.campaignId == "new") {
      //this.postEmail()
    } else {
      //this.putEmail()
    }
  }

  /*
  postEmail() {
    this.emailsApiService.postEmail(
      this.workspaceId, this.f.name.value, this.f.htmlContent.value, this.f.subject.value, this.track
    ).pipe(first())
    .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "An email named " + this.f.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/emails`])
          }
        },
        error => {
            console.log(error)
        });
  }

  putEmail() {
    this.emailsApiService.putEmail(
      this.workspaceId, this.emailId, this.f.name.value, this.f.htmlContent.value, this.f.subject.value, this.track
    ).pipe(first())
    .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "An email named " + this.f.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/emails`])
          }
        },
        error => {
            console.log(error)
        });
  }
  */

  initBlankCampaign() {
    var list = {
      name: ""
    }

    var profile = {
      name: ""
    }

    var page = {
      name: ""
    }

    var email = {
      name: ""
    }

    var domain = {
      domain: ""
    }

    var server = {
      alias: ""
    }

    var campaign = {
      name: "",
      email: email,
      pages: [page, page, page, page],
      profile: profile,
      domain: domain,
      server: server,
      targetList: list,
      port: 443,
      payloadUrl: "",
      redirectUrl: "",
      startDate: null,
      batchNumber: null,
      batchInterval: null
    }

    return campaign
  }

}

// Validator for Date and Time
export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
      isValid: {
          valid: false
      }
  };
}
