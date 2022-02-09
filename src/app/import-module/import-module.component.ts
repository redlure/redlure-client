import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailsApiService } from '../emails/emails-api.service';
import { ProfilesApiService } from '../profiles/profiles-api.service';
import { ListsApiService } from '../lists/lists-api.service';
import { PagesApiService } from '../pages/pages-api.service';
import { WorkspacesApiService } from '../workspaces/workspaces-api.service';

@Component({
  selector: 'app-import-module',
  templateUrl: './import-module.component.html'
})
export class ImportModuleComponent implements OnInit {
  myForm: FormGroup;
  @Input() type: string = "";
  workspaces: any[] = [];
  templates: any[] = [];
  loading = false;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();
  disableSubmit = true;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private listsApiService: ListsApiService,
    private emailsApiService: EmailsApiService,
    private pagesApiService: PagesApiService,
    private profilesApiService: ProfilesApiService,
    private workspacesApiService: WorkspacesApiService
  ) { }

  get formControls() { return this.myForm.controls; }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      workspace: ["", Validators.required],
      template: ["", Validators.required]
    });
    this.formControls.workspace.disable();
    this.formControls.template.disable();
    this.getWorkspaces();

  }

  getWorkspaces(): void {
    this.loading = true;
    this.workspacesApiService.getWorkspaces()
      .subscribe(
        workspaces => {
          this.workspaces = workspaces;
          this.loading = false;
          this.formControls.workspace.enable();
        });
  }

  getProfiles(): void {
    this.loading = true;
    this.profilesApiService.getProfiles(this.formControls.workspace.value)
      .subscribe(profiles => {
        this.templates = profiles;
        this.loading = false;
        this.formControls.template.enable();
      })
  }

  getEmails(): void {
    this.loading = true;
    this.emailsApiService.getEmails(this.formControls.workspace.value)
      .subscribe(emails => {
        this.templates = emails;
        this.loading = false;
        this.formControls.template.enable();
      })
  }

  getPages(): void {
    this.loading = true;
    this.pagesApiService.getPages(this.formControls.workspace.value)
      .subscribe(pages => {
        this.templates = pages;
        this.loading = false;
        this.formControls.template.enable();
      })
  }

  getLists(): void {
    this.loading = true;
    this.listsApiService.getLists(this.formControls.workspace.value)
      .subscribe(lists => {
        this.templates = lists;
        this.loading = false;
        this.formControls.template.enable();
      })
  }

  closeModal() {
    this.activeModal.close();
  }

  templateChosen() {
    this.disableSubmit = false;
  }

  workspaceChosen() {
    if (this.type == "Profile") {
      this.getProfiles();
    } else if (this.type == "Email") {
      this.getEmails();
    } else if (this.type == "List") {
      this.getLists();
    } else if (this.type == "Page") {
      this.getPages();
    }
  }

  onSubmit() {
    this.emitter.emit(this.formControls.template.value)
    this.closeModal()
  }

}
