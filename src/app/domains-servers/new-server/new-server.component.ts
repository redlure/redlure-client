import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServersApiService } from '../servers-api.service'
import { first } from 'rxjs/operators'
import { Server } from '../server.model'
import { AlertService } from '../../alert/alert.service'


@Component({
  selector: 'app-new-server',
  templateUrl: './new-server.component.html'
})
export class NewServerComponent implements OnInit {
  editServer: any;
  title = "New Server";
  submitText = "Create";
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newServer: Server;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private serversApiService: ServersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    if (this.editServer){
      this.title = "Edit Server: " + this.editServer.alias;
      this.submitText = "Update";
    } else {
      this.editServer = {
        "ip": "",
        "alias": "",
        "port": 4445
      };
    }
    this.myForm = this.formBuilder.group({
      ip: [this.editServer.ip, Validators.required],
      alias: [this.editServer.alias, Validators.required],
      port: [this.editServer.port, Validators.compose([Validators.pattern('[0-9]*'), Validators.required])]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

  postNew() {
    this.serversApiService.postServer(this.f.ip.value, this.f.alias.value, this.f.port.value)
      .pipe(first())
        .subscribe(
            data => {
                this.newServer = data;
                this.emitter.emit(this.newServer);
                this.loading = false;
                this.closeModal();
                //this.router.navigate(['workspaces/' + data['id']])
            },
            error => {
                this.loading = false;
                console.log(error)
            });
  }

  updateExisting() {
    this.serversApiService.putServer(this.editServer.id, this.f.ip.value, this.f.alias.value, this.f.port.value)
      .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.alertService.newAlert("danger", data['msg'])
            } else {
              this.editServer.ip = this.f.ip.value;
              this.editServer.alias = this.f.alias.value;
              this.editServer.port = this.f.port.value;
              this.closeModal();
            }
          
        });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true;
    if (this.title == "New Server") {
      this.postNew();
    } else {
      this.updateExisting();
    }
  
  }

}
