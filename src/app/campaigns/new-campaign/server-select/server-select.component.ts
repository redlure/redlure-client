import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CampaignsApiService } from '../../campaigns-api.service';
import { AlertService } from '../../../alert/alert.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ServersApiService } from '../../../domains-servers/servers-api.service';
import { NewCampaignService } from '../new-campaign.service';

@Component({
  selector: 'app-server-select',
  templateUrl: './server-select.component.html'
})
export class ServerSelectComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  failed = false;
  failMsg = "";
  workspaceId: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();
 

  constructor(
    private modalService: NgbModal,
    private campaignsApiService: CampaignsApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private serversApiService: ServersApiService,
    private route: ActivatedRoute,
    private newCampaignService: NewCampaignService,
  ) { }

  ngOnInit() {
    this.getData();
    this.myForm = this.formBuilder.group({
      server: [this.newCampaignService.newCampaign.server, Validators.required],
      domain: [this.newCampaignService.newCampaign.domain, Validators.required],
      port: [this.newCampaignService.newCampaign.port, Validators.compose([Validators.pattern('[0-9]*'), Validators.required])]
    });
  }

  getData(){
    this.campaignsApiService.getAllModules(this.workspaceId)
      .subscribe(data => {
        this.newCampaignService.allModules = data;
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  sslChange(event) {
   this.newCampaignService.newCampaign.ssl = event.target.checked;
  }

  get f() { return this.myForm.controls; }

  validateCerts() {
    this.campaignsApiService.validateCerts(this.workspaceId, this.f.domain.value, this.f.server.value)
    .pipe(first())
      .subscribe(
          data => {
              this.loading = false;
              if(data['exists']) {
                this.newCampaignService.newCampaign['server'] = this.f.server.value;
                this.newCampaignService.newCampaign['domain'] = this.f.domain.value;
                this.newCampaignService.newCampaign['port'] = this.f.port.value;
                this.emitter.emit(true);
                this.closeModal()
              } else {
                this.failed = true;
                this.failMsg = data['msg']
              }
          },
          error => {
              this.loading = false;
              console.log(error)
      });
  }

  validateIps() {
    this.campaignsApiService.validateIps(this.workspaceId, this.f.domain.value, this.f.server.value)
    .pipe(first())
      .subscribe(
          data => {
              if(data['success']) {
                if (this.newCampaignService.newCampaign.ssl) {
                  this.validateCerts()
                } else {
                  this.newCampaignService.newCampaign['server'] = this.f.server.value;
                  this.newCampaignService.newCampaign['domain'] = this.f.domain.value;
                  this.newCampaignService.newCampaign['port'] = this.f.port.value;
                  this.emitter.emit(true);
                  this.closeModal()
                }
                
              } else {
                this.loading = false;
                this.failed = true;
                this.failMsg = data['msg']
              }
          },
          error => {
              this.loading = false;
              console.log(error)
      });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }

    this.loading = true;

    //const server = this.newCampaignService.allModules['servers'].find( ({ alias }) => alias === this.f.server.value );
    this.serversApiService.refreshServerStatus(this.f.server.value)
      .pipe(first())
        .subscribe(
            data => {
                if(data['status'] == 'Online') {
                  this.validateIps()
                  this.serversApiService.getFiles(this.f.server.value)
                  .subscribe(files => {
                    this.newCampaignService.serverFiles = files['files'];
                  });
                } else {
                  this.loading = false
                  this.failed = true;
                  this.failMsg = "Server is not currently online";
                }
            },
            error => {
                this.loading = false;
                console.log(error)
            });

  }

}
