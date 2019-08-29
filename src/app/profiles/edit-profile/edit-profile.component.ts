import { Component, OnInit, AfterViewInit, AfterViewChecked, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfilesApiService } from '../profiles-api.service'
import { first } from 'rxjs/operators'
import { Profile } from '../profile.model'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit, AfterViewInit, AfterViewChecked {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  @Input() editProfile: Profile;
  workspaceId: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private profilesApiService: ProfilesApiService,
    private changeDetector: ChangeDetectorRef
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


  // touch each form field so validator does not think prepopulated fields are empty.
  ngAfterViewInit(){
    this.myForm.controls['name'].setValue(this.editProfile.name)
    this.myForm.controls['fromAddress'].setValue(this.editProfile.from_address)
    this.myForm.controls['smtpHost'].setValue(this.editProfile.smtp_host)
    this.myForm.controls['smtpPort'].setValue(this.editProfile.smtp_port)
    this.myForm.controls['username'].setValue(this.editProfile.username)
    this.myForm.controls['password'].setValue(this.editProfile.password)

  }

  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  tlsChange(event){
    this.editProfile.tls = event.target.checked;
  }

  sslChange(event){
    this.editProfile.ssl = event.target.checked;
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }


  onSubmit() {
    this.submitted = true;

    if(this.editProfile.tls == null && typeof this.editProfile.tls == 'undefined') {
      this.editProfile.tls = false;
    }

    if(this.editProfile.ssl == null && typeof this.editProfile.ssl == 'undefined') {
      this.editProfile.ssl = false;
    }

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true;
    this.profilesApiService.putProfile(this.workspaceId, String(this.editProfile.id), this.f.name.value, this.f.fromAddress.value, this.f.smtpHost.value,
      this.f.smtpPort.value, this.f.username.value, this.f.password.value, this.editProfile.tls, this.editProfile.ssl)
      .pipe(first())
        .subscribe(
            data => {
                this.editProfile = data;
                this.emitter.emit(this.editProfile);
                this.loading = false;
                this.closeModal()
            },
            error => {
                this.loading = false;
                console.log(error)
            });
    }

}
