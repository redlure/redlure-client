import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Email } from '../email.model'
import { EmailsApiService } from '../emails-api.service'
import { AlertService } from '../../alert/alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators'

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

  /*
  config = {
    'iframe': true,
    "disablePlugins": "table, resizer, inlinePopup, cleanHtml",
    "height": window.innerHeight * .75,
    "width": '100%',
    allowResizeX: false,
    allowResizeY: false
  }
  */

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
    if (this.emailId != 'new') {
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
        let doc =  this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
      doc.open();
      doc.write(this.f.htmlContent.value)
      doc.close();
      let frame = document.getElementById('frame')
      frame.style.height = window.innerHeight * .7 + 'px'
    }
  }

  trackChange(event){
    this.track = event.target.checked;
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true

    if (this.emailId == "new") {
      this.postEmail()
    } else {
      this.putEmail()
    }
  }

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

}
