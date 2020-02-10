import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewCampaignService } from '../new-campaign.service';

@Component({
  selector: 'app-scenario-select',
  templateUrl: './scenario-select.component.html',
})
export class ScenarioSelectComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  failed = false;
  failMsg = "";
  workspaceId: String;
  serverFiles = []
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private newCampaignService: NewCampaignService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: [this.newCampaignService.newCampaign.name, Validators.required],
      email: [this.newCampaignService.newCampaign.email, Validators.required],
      page1: [this.newCampaignService.newCampaign.pages[0]],
      page2: [this.newCampaignService.newCampaign.pages[1]],
      page3: [this.newCampaignService.newCampaign.pages[2]],
      page4: [this.newCampaignService.newCampaign.pages[3]],
      payloadUrl: [this.newCampaignService.newCampaign.payloadUrl],
      payloadFile: [this.newCampaignService.newCampaign.payloadFile],
      redirectUrl: [this.newCampaignService.newCampaign.redirectUrl],
    });

    // set form fields to "" instad of undefined so that default option shows
    if (this.newCampaignService.newCampaign.pages.length < 4) {
      this.f.page4.setValue("")
    }
    if (this.newCampaignService.newCampaign.pages.length < 3) {
      this.f.page3.setValue("")
    }
    if (this.newCampaignService.newCampaign.pages.length < 2) {
      this.f.page2.setValue("")
    }

  }

  get f() { return this.myForm.controls; }

  closeModal() {
    this.activeModal.close();
  }

  backModal() {
    this.emitter.emit("back");
    this.activeModal.close();
  }

  addPage() {
    if (this.newCampaignService.newCampaign.pages.length < 4) {
      this.newCampaignService.newCampaign.pages.push("")
    }
  }

  deletePage(index){
    this.newCampaignService.newCampaign.pages.splice(index, 1);
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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }

    //set values to newCampaign object

    this.newCampaignService.newCampaign.name = this.f.name.value;
    this.newCampaignService.newCampaign.email = this.f.email.value;
    this.newCampaignService.newCampaign.redirectUrl = this.f.redirectUrl.value;
    this.newCampaignService.newCampaign.payloadUrl = this.f.payloadUrl.value;
    this.newCampaignService.newCampaign.payloadFile = this.f.payloadFile.value;

    if (this.f.page1.value) { this.newCampaignService.newCampaign.pages[0] = this.f.page1.value; }
    if (this.f.page2.value) { this.newCampaignService.newCampaign.pages[1] = this.f.page2.value; }
    if (this.f.page3.value) { this.newCampaignService.newCampaign.pages[2] = this.f.page3.value; }
    if (this.f.page4.value) { this.newCampaignService.newCampaign.pages[3] = this.f.page4.value; }

    this.emitter.emit("next");
    this.activeModal.close();
  }

}
