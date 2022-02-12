import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
  file: File;
  attach: Boolean;
  fileName = 'No Attachment';
  fileSize = 0;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private newCampaignService: NewCampaignService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    if (this.newCampaignService.getAttachmentName() == "") {
      this.attach = true;
    } else {
      this.attach = false;
    }
    this.myForm = this.formBuilder.group({
      name: [this.newCampaignService.newCampaign.name, Validators.required],
      email: [this.newCampaignService.newCampaign.email, Validators.required],
      attachment: [this.newCampaignService.getAttachmentName()],
      page1: [this.newCampaignService.newCampaign.pages[0]],
      page2: [this.newCampaignService.newCampaign.pages[1]],
      page3: [this.newCampaignService.newCampaign.pages[2]],
      page4: [this.newCampaignService.newCampaign.pages[3]],
      payloadUrl: [this.newCampaignService.newCampaign.payloadUrl, Validators.pattern(RegExp('^\/'))],
      payloadFile: [this.newCampaignService.newCampaign.payloadFile],
      redirectUrl: [this.newCampaignService.newCampaign.redirectUrl],
      safetyUrl: [this.newCampaignService.newCampaign.safetyUrl],
    });

    // set form fields to "" instad of undefined so that default option shows
    if (this.newCampaignService.newCampaign.pages.length < 4) {
      this.formControls.page4.setValue("")
    }
    if (this.newCampaignService.newCampaign.pages.length < 3) {
      this.formControls.page3.setValue("")
    }
    if (this.newCampaignService.newCampaign.pages.length < 2) {
      this.formControls.page2.setValue("")
    }

  }

  get formControls() { return this.myForm.controls; }

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

  deletePage(index) {
    this.newCampaignService.newCampaign.pages.splice(index, 1);
    if (index == 0) {
      this.formControls.page1.setValue("")
    } else if (index == 1) {
      this.formControls.page2.setValue("")
    } else if (index == 2) {
      this.formControls.page3.setValue("")
    } else if (index == 3) {
      this.formControls.page4.setValue("")
    }
  }

  attachFile(file) {
    if (file.target.files.length > 0) {
      this.file = file.target.files[0];
      this.fileName = this.file.name;
      this.fileSize = this.file.size;
      this.formControls.attachment.setValue(this.file.name);
      this.attach = false;
    }

  }

  removeAttachment() {
    this.attach = true;
    this.file = void 0;
    this.newCampaignService.newCampaign.attachment = null;
    this.formControls.attachment.setValue("");
  }

  get attachmentName() {
    return this.newCampaignService.newCampaign.attachment.name;
  }


  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.newCampaignService.newCampaign.name = this.formControls.name.value;
      this.newCampaignService.newCampaign.email = this.formControls.email.value;
      this.newCampaignService.newCampaign.redirectUrl = this.formControls.redirectUrl.value;
      this.newCampaignService.newCampaign.safetyUrl = this.formControls.safetyUrl.value;
      this.newCampaignService.newCampaign.payloadUrl = this.formControls.payloadUrl.value;
      this.newCampaignService.newCampaign.payloadFile = this.formControls.payloadFile.value;

      this.newCampaignService.newCampaign.attachment = this.file;

      if (this.formControls.page1.value) { this.newCampaignService.newCampaign.pages[0] = this.formControls.page1.value; }
      if (this.formControls.page2.value) { this.newCampaignService.newCampaign.pages[1] = this.formControls.page2.value; }
      if (this.formControls.page3.value) { this.newCampaignService.newCampaign.pages[2] = this.formControls.page3.value; }
      if (this.formControls.page4.value) { this.newCampaignService.newCampaign.pages[3] = this.formControls.page4.value; }

      this.emitter.emit("next");
      this.activeModal.close();
    }
  }
}
