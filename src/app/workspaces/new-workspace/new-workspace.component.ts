import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WorkspacesApiService } from '../workspaces-api.service'
import { first } from 'rxjs/operators'
import { Workspace } from '../workspace.model'
import { AlertService } from '../../alert/alert.service'


@Component({
  selector: 'app-new-workspace',
  templateUrl: './new-workspace.component.html'
})

export class NewWorkspaceComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  loading = false;
  newWorkspace: Workspace;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private workspacesApiService: WorkspacesApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true;
    this.workspacesApiService.postWorkspace(this.f.name.value)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                if (data['success'] == false) {
                  this.alertService.newAlert("warning", this.f.name.value + " is an existing workspace")
                } else {
                  this.newWorkspace = data;
                  this.emitter.emit(this.newWorkspace);
                  this.closeModal()
                }
            },
            error => {
                this.loading = false;
            });
            
}

}
