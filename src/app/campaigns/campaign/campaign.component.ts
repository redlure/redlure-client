import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Campaign } from '../campaign.model'
import { CampaignsApiService } from '../campaigns-api.service'
import { AlertService } from '../../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators'


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html'
})
export class CampaignComponent implements OnInit {
  editCampaign: any;
  pageCount = []
  track = true;

  workspaceId: String;
  campaignId: String;

  pages: String[];
  lists: String[];
  emails: String[];
  profiles: String[];
  domains: String[];
  servers: String[];

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
    private campaignsApiService: CampaignsApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId']);
    this.route.params.subscribe(params => this.campaignId = params['campaignId']);
    if (this.campaignId != 'new') {
      this.editCampaign = this.router.getCurrentNavigation().extras.state
      if (this.editCampaign == null) {
        this.router.navigate([`/workspaces/${this.workspaceId}/campaigns`]);
      }

      this.editCampaign.pages.forEach(element => {
        this.pageCount.push(1);
      });
      // sort pages by index (order in which they are supposed to chain)
      this.editCampaign.pages.sort((a, b) => a.index < b.index ? -1: a.name > b.name ? 1: 0)
  
      this.track = this.editCampaign.track;
      this.title1 = "EDIT C";
      this.title2 = "AMPAIGN";
      this.saveBtnText = "Save";
    } else {
      this.editCampaign = this.initBlankCampaign();
      this.pageCount.push(1);
      this.ssl = true;
      this.title1 = "NEW C";
      this.title2 = "AMPAIGN";
      this.saveBtnText = "Create";
    }
   }

  ngOnInit() {
    this.getData();

    var page1name = ""
    var page2name = ""
    var page3name = ""
    var page4name = ""

    //console.log(this.editCampaign.pages)
    if (this.editCampaign.pages[0].page) {
      page1name = this.editCampaign.pages[0].page.name
    }
    if (this.editCampaign.pages[1]) {
      page2name = this.editCampaign.pages[1].page.name
    } 
    if (this.editCampaign.pages[2]) {
      page3name = this.editCampaign.pages[2].page.name
    }
    if (this.editCampaign.pages[3]) {
      page4name = this.editCampaign.pages[3].page.name
    } 
    
    this.myForm = this.formBuilder.group({
      // campaign name
      name: [this.editCampaign.name, Validators.required],
      // email component
      email: [this.editCampaign.email.name, Validators.required],
      //page components
      page1: [page1name],//[this.editCampaign.pages[0].name],
      page2: [page2name],//[this.editCampaign.pages[1].name],
      page3: [page3name],//[this.editCampaign.pages[2].name],
      page4: [page4name],//[this.editCampaign.pages[3].name],
      //profile component
      profile: [this.editCampaign.profile.name, Validators.required],
      // domain component
      domain: [this.editCampaign.domain.domain, Validators.required],
      // server component
      server: [this.editCampaign.server.alias, Validators.required],
      // list component
      targetList: [this.editCampaign.list.name, Validators.required],
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

  addPage() {
    if (this.pageCount.length < 4) {
      this.pageCount.push(1)
    }
  }

  deletePage(index){
    this.pageCount.splice(index, 1);
    if (index == 0) {
      this.f.page1.setValue("")
    } else if(index == 1) {
      this.f.page2.setValue("")
    } else if(index == 2) {
      this.f.page3.setValue("")
    } else if(index == 3) {
      this.f.page4.setValue("")
    }

  }

  getData(){
    this.campaignsApiService.getAllModules(this.workspaceId)
      .subscribe(data => {
        this.domains = data['domains'];
        this.servers = data['servers'];
        this.pages = data['pages'];
        this.lists = data['lists'];
        this.profiles = data['profiles'];
        this.emails = data['emails'];
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
      this.postCampaign()
    } else {
      //this.putCampaign()
    }
  }

  
  postCampaign() {
    this.loading=true
    var pageArr: String[] = [];
    if (this.f.page1.value) { pageArr.push(this.f.page1.value) }
    if (this.f.page2.value) { pageArr.push(this.f.page2.value) }
    if (this.f.page3.value) { pageArr.push(this.f.page3.value) }
    if (this.f.page4.value) { pageArr.push(this.f.page4.value) }

    this.campaignsApiService.postCampaign(
      this.workspaceId, this.f.name.value, this.f.email.value, this.f.profile.value, this.f.targetList.value, this.f.batchNumber.value,
      this.f.batchInterval.value, this.f.startDate.value, this.f.domain.value, this.f.server.value, this.f.port.value, this.ssl, pageArr,
      this.f.redirectUrl.value, this.f.payloadUrl.value
    ).pipe(first())
    .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "An campaign named " + this.f.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/campaigns`])
          }
        },
        error => {
            console.log(error)
        });
  }

  /*
  putCampaign() {
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

    var pageDict = {
      page: {
        name: ""
      }
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
      pages: [pageDict, pageDict, pageDict, pageDict],
      profile: profile,
      domain: domain,
      server: server,
      list: list,
      port: 443,
      payloadUrl: "",
      redirectUrl: "",
      startDate: "",
      batchNumber: "",
      batchInterval: ""
    }

    return campaign
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
