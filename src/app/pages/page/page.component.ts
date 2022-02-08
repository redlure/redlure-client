import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PagesApiService } from '../pages-api.service'
import { AlertService } from '../../alert/alert.service'
import { CloneSiteComponent } from './clone-site/clone-site.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators'
import { VariableHelpComponent } from '../../variable-help/variable-help.component';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  btnText = "Preview";
  preview = false;
  currentStyle = {
    'display': 'none'
  }
  editPage: any;

  workspaceId: String;
  pageId: String;

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
    { variable: "{{ next_url }}", description: "Link inlcuding unique recipient ID to the campaign's next configured page, in sequence" },
    { variable: "{{ payload_url }}", description: "Link inlcuding unique recipient ID to a campaign's selected payload. Example: <a href=\"{{ payload_url }}\" style=\"cursor: pointer;\">Download here</a>" },
    { variable: "{{ serve_payload }}", description: "Add this variable to anywhere to your page to have a campaign's selected payload automatically download when browsed to. Uses: <meta http-equiv=\"refresh\" content=\"0; url={{ payload_url }}\">" },
    { variable: "{{ loginfmt }}", description: "Display the value from the prior page's form input where name=\"loginfmt\" (Pages with this variable must not be the 1st page used in a sequence)" },
    { variable: "{{  username  }}", description: "Display the value from the prior page's form input where name=\"username\" (Pages with this variable must not be the 1st page used in a sequence)" },
    { variable: "{{ email }}", description: "Display the value from the prior page's form input where name=\"email\" (Pages with this variable must not be the 1st page used in a sequence)" },
  ]

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
    private pagesApiService: PagesApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.route.params.subscribe(params => this.workspaceId = params['workspaceId'])
    this.route.params.subscribe(params => this.pageId = params['pageId'])
    if (this.pageId !== 'new') {
      this.editPage = router.getCurrentNavigation().extras.state
      if (this.editPage == null) {
        this.router.navigate([`/workspaces/${this.workspaceId}/pages`])
      }
      this.title1 = "EDI"
      this.title2 = "T PAGE"
      this.saveBtnText = "Save"
    } else {
      this.editPage = {
        "name": "",
        "url": "",
        "html": ""
      }
      this.title1 = "NE"
      this.title2 = "W PAGE"
      this.saveBtnText = "Create"
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: [this.editPage.name, Validators.required],
      url: [this.editPage.url, [Validators.required, Validators.pattern(RegExp('^\/'))]],
      htmlContent: [this.editPage.html]
    });
  }

  return() {
    this.router.navigate([`/workspaces/${this.workspaceId}/pages`])
  }

  showVariables() {
    const modalRef = this.modalService.open(VariableHelpComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'Page Variables';
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

  cloneSite() {
    const modalRef = this.modalService.open(CloneSiteComponent);
    modalRef.componentInstance.emitter.subscribe(
      data => {
        this.formControls.htmlContent.setValue(data);
      }
    );
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.loading = true

      if (this.pageId == "new") {
        this.postPage()
      } else {
        this.putPage()
      }
    }
  }

  postPage() {
    this.pagesApiService.postPage(
      this.workspaceId, this.formControls.name.value, this.formControls.htmlContent.value, this.formControls.url.value
    ).pipe(first())
      .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "A page named " + this.formControls.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/pages`])
          }
        },
        error => {
          console.log(error)
        });
  }

  putPage() {
    this.pagesApiService.putPage(
      this.workspaceId, this.pageId, this.formControls.name.value, this.formControls.htmlContent.value, this.formControls.url.value
    ).pipe(first())
      .subscribe(
        data => {
          this.loading = false
          if (data['success'] == false) {
            this.alertService.newAlert("warning", "A page named " + this.formControls.name.value + " already exists in the database")
          } else {
            this.router.navigate([`/workspaces/${this.workspaceId}/pages`])
          }
        },
        error => {
          console.log(error)
        });
  }

}
