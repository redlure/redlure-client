import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ListsApiService } from '../lists-api.service'
import { first } from 'rxjs/operators'
import { List } from '../list.model'
import { AlertService } from '../../alert/alert.service'
import { Target } from '../targets/target.model';


@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html'
})

export class NewListComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newList: List;
  tls: false;
  ssl: false;
  workspaceId: String;
  targets: Target[] = [];
  newTarget: Target;
  csvContent: String;
  file: File;

  first_name: String;
  last_name: String;
  email: String;

  headers = ["#", "First Name", "Last Name", "Email", "Actions"]

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private listsApiService: ListsApiService,
    private alertService: AlertService,
  ) { }


  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      email: ['', Validators.email]
    });
  
    this.workspaceId = this.router.url.split('/')[2];
  }

  onFileSelect(file) {
    this.file = file.target.files[0];
  }

  deleteTarget(target){
    const index: number = this.targets.indexOf(target);
    this.targets.splice(index, 1);
  }

  insertTarget() {
    if (!this.f.email.errors && this.f.email.value != "") {
      this.newTarget = {
        id: null,
        first_name: this.f.first_name.value,
        last_name: this.f.last_name.value,
        email: this.f.email.value
      }

      this.targets.push(this.newTarget);
      this.f.first_name.setValue("");
      this.f.last_name.setValue("");
      this.f.email.setValue("");
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid || this.targets.length == 0) {
        return;
    }

    this.loading = true;
    this.listsApiService.postList(this.workspaceId, this.f.name.value, this.targets)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                if (data['success'] == false){ 
                  this.sendAlert(this.f.name.value)
                } else {
                  this.newList = data;
                  this.emitter.emit(this.newList);
                  this.closeModal()
                }
            },
            error => {
                this.loading = false;
                console.log(error)
            });
    }

    sendAlert(name) {
      this.alertService.newAlert("warning", "A list with the name" + name + " already exists in the database")
    }
}
