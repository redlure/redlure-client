import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfilesApiService } from '../profiles-api.service'
import { first } from 'rxjs/operators'
import { Profile } from '../profile.model'
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html'
})

export class NewProfileComponent implements OnInit {
  passwordType = "password";
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newProfile: Profile;
  tls: false;
  ssl: false;
  workspaceId: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private profilesApiService: ProfilesApiService,
    private alertService: AlertService,
  ) { }


  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      fromAddress: ['', Validators.required],
      smtpHost: ['', Validators.required],
      smtpPort: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      username: [''],
      password: ['']
    });

    this.workspaceId = this.router.url.split('/')[2];
  }

  tlsChange(event) {
    this.tls = event.target.checked;
  }

  sslChange(event) {
    this.ssl = event.target.checked;
  }

  closeModal() {
    this.activeModal.close();
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.tls == null && typeof this.tls == 'undefined') {
      this.tls = false;
    }

    if (this.ssl == null && typeof this.ssl == 'undefined') {
      this.ssl = false;
    }

    if (this.myForm.valid) {
      this.loading = true;
      this.profilesApiService.postProfile(this.workspaceId, this.formControls.name.value, this.formControls.fromAddress.value, this.formControls.smtpHost.value,
        this.formControls.smtpPort.value, this.formControls.username.value, this.formControls.password.value, this.tls, this.ssl)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.sendAlert(this.formControls.name.value)
            } else {
              this.newProfile = data;
              this.emitter.emit(this.newProfile);
              this.closeModal()
            }
          },
          error => {
            this.loading = false;
            console.log(error)
          });
    }
  }

  sendAlert(name) {
    this.alertService.newAlert("danger", name + " is an already existing profile")
  }

  togglePassword(setting) {
    this.passwordType = setting;
  }
}
