import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailsApiService } from '../emails-api.service'
import { AlertService } from '../../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators'
import { VariableHelpComponent } from '../../variable-help/variable-help.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  btnText = "Preview";
  preview = false;
  currentStyle = {
    'display': 'none'
  }
  editEmail: any;
  track = true;

  workspaceId: String;
  emailId: String;

  myForm: FormGroup;
  loading = false;
  submitted = false;

  title1: String;
  title2: String;
  saveBtnText: String;

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  options = {
    lineNumbers: true,
    theme: 'material-darker',
    mode: 'htmlmixed',
    indentUnit: 4,
  }

  variables = [
    { variable: "{{ url }}", description: "Unique URL to a campaign's inital landing page. Example: http[s]://domain.com/page1?id=XXXXX" },
    { variable: "{{ payload_url }}", description: "Unique URL to a campaign's chosen payload, hosted on a worker. Example: http[s]://domain.com/enablemacros.xls?id=XXXXX" },
    { variable: "{{ fname }}", description: "The first name of the email recipient" },
    { variable: "{{ lname }}", description: "The last name of the email recipient" },
    { variable: "{{ name }}", description: "Combined first and last name of the recipient" },
    { variable: "{{ email }}", description: "The email address of the recipient" },
    { variable: "{{ id }}", description: "The unique tracking ID used to identify the recipient" }
  ]

  descriptions = [
    "Unique URL to a campaign's chosen payload, hosted on a worker. Example: http[s]://domain.com/enablemacros.xls?id=XXXXX",
    "The first name of the email recipient",
    "The last name of the email recipient",
    "Combined first and last name of the recipient",
    "The email address of the recipient",
    "The unique tracking ID used to identify the recipient"
  ]

  constructor(
    private route: ActivatedRoute,
    private emailsApiService: EmailsApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
    this.route.params.subscribe(params => this.emailId = params['emailId'])
    if (this.emailId !== 'new') {
      this.editEmail = router.getCurrentNavigation().extras.state
      if (this.editEmail == null) {
        this.router.navigate([`/workspaces/${this.workspaceId}/emails`])
      }
      this.track = this.editEmail.track
      this.title1 = "EDI"
      this.title2 = "T EMAIL"
      this.saveBtnText = "Save"
    } else {
      this.editEmail = {
        "name": "",
        "html": "",
        "subject": "",
        "track": true
      }
      this.title1 = "NE"
      this.title2 = "W EMAIL"
      this.saveBtnText = "Create"
    }
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: [this.editEmail.name, Validators.required],
      htmlContent: [this.editEmail.html],
      subject: [this.editEmail.subject, Validators.required],
    });
  }

  return() {
    this.router.navigate([`/workspaces/${this.workspaceId}/emails`])
  }

  showVariables() {
    const modalRef = this.modalService.open(VariableHelpComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'Email Variables';
    modalRef.componentInstance.variables = this.variables;
  }

  previewHTML() {
    if (this.preview) {
      this.preview = false;
      this.btnText = "Preview";
      this.currentStyle = {
        'display': 'none'
      }
    } else {
      this.preview = true;
      this.btnText = "Code"
      this.currentStyle = {
        'display': 'block'
      }
      let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
      doc.open();
      doc.write(this.formControls.htmlContent.value)
      doc.close();
      let frame = document.getElementById('frame')
      frame.style.height = window.innerHeight * .7 + 'px'
    }
  }

  trackChange(event) {
    this.track = event.target.checked;
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.loading = true

      if (this.emailId == "new") {
        this.postEmail()
      } else {
        this.putEmail()
      }
    }
  }

  postEmail() {
    this.emailsApiService.postEmail(
      this.workspaceId, this.formControls.name.value, this.formControls.htmlContent.value, this.formControls.subject.value, this.track
    ).pipe(first())
      .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "An email named " + this.formControls.name.value + " already exists in the database")
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
      this.workspaceId, this.emailId, this.formControls.name.value, this.formControls.htmlContent.value, this.formControls.subject.value, this.track
    ).pipe(first())
      .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "An email named " + this.formControls.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/emails`])
          }
        },
        error => {
          console.log(error)
        });
  }

}
